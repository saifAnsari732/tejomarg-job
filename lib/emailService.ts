import nodemailer from "nodemailer";

interface InvoiceData {
  invoiceId: string;
  date: string;
  employerName: string;
  companyName: string;
  billingEmail: string;
  jobTitle: string;
  plan: string;
  amount: number;
  paymentId: string;
  couponCode?: string;
  jobId: string;
}

export async function sendInvoiceEmail(data: InvoiceData) {
  try {
    let transporter;

    // Check if real SMTP credentials exist
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Use Ethereal Email for testing if no real credentials exist
      const testAccount = await nodemailer.createTestAccount();
      console.log("Created Ethereal Test Account:", testAccount.user);

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const discountRow = data.couponCode
      ? `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; color: #475569;">
          <strong>Discount Applied</strong><br>
          <small>Coupon: ${data.couponCode}</small>
        </td>
        <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">-</td>
        <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #10b981; font-weight: bold;">(Discounted)</td>
      </tr>
      `
      : "";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); padding: 40px; color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.5px;">INVOICE</h1>
                <p style="margin: 5px 0 0; color: #c7d2fe;">Receipt for Job Posting</p>
              </td>
              <td align="right">
                <div style="font-size: 24px; font-weight: 900; color: #ffffff;">TELEMEDIA</div>
                <p style="margin: 5px 0 0; font-size: 12px; color: #a5b4fc;">NETWORK PVT LTD</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
            <tr>
              <td valign="top">
                <p style="margin: 0 0 5px; font-size: 11px; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 1px;">Billed To</p>
                <h3 style="margin: 0 0 10px; font-size: 18px; color: #1e293b;">${data.companyName}</h3>
                <p style="margin: 0 0 5px; color: #475569; font-size: 14px;">${data.employerName}</p>
                <p style="margin: 0; color: #64748b; font-size: 14px;">${data.billingEmail}</p>
              </td>
              <td valign="top" align="right" style="background-color: #e0e7ff; padding: 20px; border-radius: 12px; border: 1px solid #c7d2fe;">
                <p style="margin: 0 0 5px; font-size: 11px; font-weight: 800; color: #818cf8; text-transform: uppercase; letter-spacing: 1px;">Invoice Details</p>
                <p style="margin: 0 0 8px; font-size: 14px; color: #1e293b;"><strong>No:</strong> INV-${data.invoiceId}</p>
                <p style="margin: 0 0 8px; font-size: 14px; color: #1e293b;"><strong>Date:</strong> ${data.date}</p>
                <p style="margin: 0 0 12px; font-size: 14px; color: #1e293b;"><strong>Pay ID:</strong> ${data.paymentId}</p>
                <span style="background-color: #10b981; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">PAID SUCCESS</span>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="padding: 15px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Description</th>
                <th style="padding: 15px; text-align: center; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Plan</th>
                <th style="padding: 15px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1e293b; font-size: 16px;">${data.jobTitle}</strong>
                  <br><span style="color: #64748b; font-size: 13px;">Job Posting Fee</span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: center;">
                  <span style="background-color: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold;">${data.plan}</span>
                </td>
                <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b; font-size: 16px; font-weight: bold;">
                  ₹${data.amount}.00
                </td>
              </tr>
              ${discountRow}
            </tbody>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%"></td>
              <td width="50%" align="right">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Subtotal</td>
                    <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold;">₹${data.amount}.00</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #e2e8f0;">Tax (0%)</td>
                    <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">₹0.00</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0; font-size: 18px; font-weight: 900; color: #1e293b;">Total Paid</td>
                    <td style="padding: 15px 0; text-align: right; font-size: 18px; font-weight: 900; color: #4f46e5;">Paid</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- CTA -->
          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${data.jobId}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px;">View Full Invoice Online</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 500;">Thank you for doing business with Telemedia Network Pvt Ltd.</p>
          <p style="margin: 5px 0 0; color: #94a3b8; font-size: 13px;">For any billing queries, please contact <span style="color: #4f46e5;">billing@telemedianetwork.com</span></p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Telemedia Network" <billing@telemedianetwork.com>',
      to: data.billingEmail,
      subject: `Invoice for your Job Posting - ${data.jobTitle}`,
      html: htmlContent,
    });

    console.log("Invoice email sent successfully! Message ID:", info.messageId);
    
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return true;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return false;
  }
}
