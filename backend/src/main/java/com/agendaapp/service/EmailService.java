package com.agendaapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String remitente;

    public EmailService(JavaMailSender mailSender, @Value("${app.mail.from}") String remitente) {
        this.mailSender = mailSender;
        this.remitente = remitente;
    }

    public void enviarRecuperacion(String destino, String nombre, String enlace, long minutosVigencia) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setFrom(remitente);
        mensaje.setTo(destino);
        mensaje.setSubject("Recupera tu contraseña - Agenda Fácil");
        mensaje.setText("Hola " + nombre + ",\n\n"
                + "Recibimos una solicitud para restablecer la contraseña de tu cuenta en Agenda Fácil.\n\n"
                + "Abre este enlace para crear una nueva contraseña (vale " + minutosVigencia + " minutos):\n"
                + enlace + "\n\n"
                + "Si no hiciste esta solicitud, ignora este mensaje: tu contraseña no cambiará.\n");
        mailSender.send(mensaje);
    }
}
