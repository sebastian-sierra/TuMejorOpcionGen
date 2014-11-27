/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.csw.co.fantasticos.threads;

import co.edu.uniandes.csw.co.fantasticos.client.logic.dto.ClientDTO;
import co.edu.uniandes.csw.co.fantasticos.client.persistence.api.IClientPersistence;
import co.edu.uniandes.csw.co.fantasticos.giftcard.logic.dto.GiftCardDTO;
import co.edu.uniandes.csw.co.fantasticos.shop.logic.dto.ShopDTO;
import java.util.Properties;
import javax.inject.Inject;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 *
 * @author sebastiansierra
 */
public class ThreadEnviarCorreo extends Thread {

    private final ClientDTO sender;
    private final GiftCardDTO giftCard;
    private final String receiver;
    private final String shop;
    private final String destinaryEmail;

    public ThreadEnviarCorreo(ClientDTO sender, GiftCardDTO giftCard, String destinaryEmail) {
        this.sender = sender;
        this.giftCard = giftCard;
        this.receiver = giftCard.getDestinaryId();
        this.shop = giftCard.getShopId();
        this.destinaryEmail = destinaryEmail;
    }

    public void run() {
          
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("noreply.tumejoropcion@gmail.com", "Soytumejoropcion69");
            }
        });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("noreply.tumejoropcion@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinaryEmail));
            message.setSubject("Bienvenido, " + receiver);
            message.setText("Hola " + receiver + "!,\n  De parte del equipo de  TuMejorOpcion.com, queremos informarle que usted ha recibido un bono de regalo  con la siguiente información"
                    + "\n Marca: " +shop+
                    "\n Valor: " +giftCard.getValue()+
                    "\n De parte de: " +sender.getName()+
                    "\n Número de identificación del bono: " +giftCard.getId()+
                    "\n Esperamos que lo disfrute,\n Gracias por su atencion.\n Equipo TuMejorOpcion.com ");

            Transport.send(message);

            System.out.println("Done");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

    }
}
