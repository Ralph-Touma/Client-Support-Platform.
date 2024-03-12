import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not defined in the environment variables');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  export const sendEmail = async (to: string, subject: string, text: string) => {
    const msg = {
      to,
      from: process.env.SENDGRID_VERIFIED_SENDER as string, 
      subject,
      text,
    };
  
    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send email", error);
      throw error;
    }
  };
