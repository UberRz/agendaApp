package com.agendaapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.MXRecord;
import org.xbill.DNS.Name;
import org.xbill.DNS.Record;
import org.xbill.DNS.TextParseException;
import org.xbill.DNS.Type;

import java.time.Duration;
import java.util.Locale;

@Component
public class EmailDomainValidator {

    private static final Logger log = LoggerFactory.getLogger(EmailDomainValidator.class);

    static final String MENSAJE_ERROR = "El dominio del correo no puede recibir mensajes";
    private static final Duration TIMEOUT = Duration.ofSeconds(3);

    public record ResultadoDns(int codigo, Record[] respuestas) {
    }

    private final boolean habilitado;

    public EmailDomainValidator(@Value("${app.email.mx-validation-enabled:true}") boolean habilitado) {
        this.habilitado = habilitado;
    }

    public void validarDominio(String email) {
        if (!habilitado) {
            return;
        }
        String dominio = extraerDominio(email);
        if (dominio == null) {
            throw new IllegalArgumentException(MENSAJE_ERROR);
        }

        ResultadoDns mx = consultar(dominio, Type.MX);
        if (tieneRespuestas(mx)) {
            if (esNullMx(mx.respuestas())) {
                throw new IllegalArgumentException(MENSAJE_ERROR);
            }
            return;
        }
        if (fallaTransitoria(mx)) {
            advertir(dominio);
            return;
        }
        if (mx.codigo() == Lookup.HOST_NOT_FOUND) {
            throw new IllegalArgumentException(MENSAJE_ERROR);
        }

        // Sin registros MX: el estándar permite recibir correo en el registro A/AAAA del dominio.
        for (int tipo : new int[] { Type.A, Type.AAAA }) {
            ResultadoDns resultado = consultar(dominio, tipo);
            if (tieneRespuestas(resultado)) {
                return;
            }
            if (fallaTransitoria(resultado)) {
                advertir(dominio);
                return;
            }
        }
        throw new IllegalArgumentException(MENSAJE_ERROR);
    }

    protected ResultadoDns consultar(String dominio, int tipo) {
        try {
            Lookup.getDefaultResolver().setTimeout(3);
            String nombre = dominio.endsWith(".") ? dominio : dominio + ".";
            Lookup lookup = new Lookup(nombre, tipo);
            Record[] respuestas = lookup.run();
            return new ResultadoDns(lookup.getResult(), respuestas);
        } catch (TextParseException e) {
            return new ResultadoDns(Lookup.HOST_NOT_FOUND, null);
        } catch (RuntimeException e) {
            return new ResultadoDns(Lookup.UNRECOVERABLE, null);
        }
    }

    private String extraerDominio(String email) {
        if (email == null) {
            return null;
        }
        int arroba = email.lastIndexOf('@');
        if (arroba < 0 || arroba == email.length() - 1) {
            return null;
        }
        String dominio = email.substring(arroba + 1).trim().toLowerCase(Locale.ROOT);
        return dominio.isEmpty() ? null : dominio;
    }

    private boolean tieneRespuestas(ResultadoDns resultado) {
        return resultado.codigo() == Lookup.SUCCESSFUL
                && resultado.respuestas() != null
                && resultado.respuestas().length > 0;
    }

    private boolean fallaTransitoria(ResultadoDns resultado) {
        return resultado.codigo() == Lookup.TRY_AGAIN || resultado.codigo() == Lookup.UNRECOVERABLE;
    }

    private boolean esNullMx(Record[] respuestas) {
        return respuestas.length == 1
                && respuestas[0] instanceof MXRecord mx
                && mx.getPriority() == 0
                && Name.root.equals(mx.getTarget());
    }

    private void advertir(String dominio) {
        log.warn("Consulta DNS no concluyente para el dominio {}; se permite el registro", dominio);
    }
}
