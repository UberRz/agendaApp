package com.agendaapp.service;

import org.junit.jupiter.api.Test;
import org.xbill.DNS.ARecord;
import org.xbill.DNS.DClass;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.MXRecord;
import org.xbill.DNS.Name;
import org.xbill.DNS.Record;
import org.xbill.DNS.Type;

import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class EmailDomainValidatorTest {

    private static final Name DOMINIO = Name.fromConstantString("example.com.");
    private static final String CORREO = "persona@example.com";

    private static EmailDomainValidator validador(boolean habilitado,
            Map<Integer, EmailDomainValidator.ResultadoDns> respuestas,
            AtomicInteger llamadas) {
        return new EmailDomainValidator(habilitado) {
            @Override
            protected ResultadoDns consultar(String dominio, int tipo) {
                llamadas.incrementAndGet();
                return respuestas.getOrDefault(tipo, new ResultadoDns(Lookup.TYPE_NOT_FOUND, null));
            }
        };
    }

    private static Record mx(int prioridad, Name destino) {
        return new MXRecord(DOMINIO, DClass.IN, 300, prioridad, destino);
    }

    private static Record registroA() throws Exception {
        return new ARecord(DOMINIO, DClass.IN, 300,
                InetAddress.getByAddress(new byte[] { 93, (byte) 184, (byte) 216, 34 }));
    }

    @Test
    void deshabilitadoNoConsultaDns() {
        AtomicInteger llamadas = new AtomicInteger();
        EmailDomainValidator v = validador(false, new HashMap<>(), llamadas);
        assertDoesNotThrow(() -> v.validarDominio(CORREO));
        assertEquals(0, llamadas.get());
    }

    @Test
    void dominioInexistenteLanza() {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.HOST_NOT_FOUND, null));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> v.validarDominio(CORREO));
        assertEquals(EmailDomainValidator.MENSAJE_ERROR, ex.getMessage());
    }

    @Test
    void conMxPasa() {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.SUCCESSFUL,
                new Record[] { mx(10, Name.fromConstantString("mail.example.com.")) }));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        assertDoesNotThrow(() -> v.validarDominio(CORREO));
    }

    @Test
    void sinMxPeroConRegistroAPasa() throws Exception {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.TYPE_NOT_FOUND, null));
        r.put(Type.A, new EmailDomainValidator.ResultadoDns(Lookup.SUCCESSFUL, new Record[] { registroA() }));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        assertDoesNotThrow(() -> v.validarDominio(CORREO));
    }

    @Test
    void sinMxNiAniAaaaLanza() {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.TYPE_NOT_FOUND, null));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        assertThrows(IllegalArgumentException.class, () -> v.validarDominio(CORREO));
    }

    @Test
    void nullMxLanza() {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.SUCCESSFUL,
                new Record[] { mx(0, Name.root) }));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        assertThrows(IllegalArgumentException.class, () -> v.validarDominio(CORREO));
    }

    @Test
    void errorDeRedNoRechaza() {
        Map<Integer, EmailDomainValidator.ResultadoDns> r = new HashMap<>();
        r.put(Type.MX, new EmailDomainValidator.ResultadoDns(Lookup.TRY_AGAIN, null));
        EmailDomainValidator v = validador(true, r, new AtomicInteger());
        assertDoesNotThrow(() -> v.validarDominio(CORREO));
    }

    @Test
    void correoSinArrobaLanza() {
        EmailDomainValidator v = validador(true, new HashMap<>(), new AtomicInteger());
        assertThrows(IllegalArgumentException.class, () -> v.validarDominio("sin-arroba"));
    }
}
