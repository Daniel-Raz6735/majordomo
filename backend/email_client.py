from config import config
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
params = config(filename='email_info.ini', section='email')


class EmailManager:
    @staticmethod
    def email_admin(subject, message):
        admin_mail = params["admin_address"]
        send_email(admin_mail, subject, message)


def send_email(target_address, subject, text, html=None):
    """send an email to a target. if you have special html code to put the text in you can send it as a parameter """
    user_name = params['username']
    server.login(user_name, params['password'])
    source_address = params['server_address']

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = source_address
    message["To"] = target_address
    if html is None:
        html = """<html><body><p> """ + text + """"</p></body></html>"""

    # convert both parts to MIMEText objects and add them to the MIMEMultipart message
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    # send your email
    server.sendmail(source_address, target_address, message.as_string())
    server.quit()
    print('Sent')


demo_text = """
    Hi,
    this is a test email:
    this is my site
    https://majordomo-me.web.app/
    Feel free to take a look!"""

demo_html = """
    <html>
      <body>
        <p>Hi,<br>
           this is a test email:</p>
        <p><a  href="https://majordomo-me.web.app/">this is my site</a></p>
        <p style="color:red;background:black;"> Feel free to take a look!</p>
      </body>
    </html>
    """

if __name__ == '__main__':
    send_email("shlomow6@gmail.com", "Email test", demo_text, demo_html)
