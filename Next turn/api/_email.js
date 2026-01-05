/**
 * Email Service for Vercel Serverless
 * Handles all email notifications using Nodemailer
 */

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Initialize email transporter
 */
function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  return transporter;
}

/**
 * Send email notification
 */
async function sendEmail(to, subject, htmlContent) {
  try {
    const emailTransporter = getTransporter();
    
    const mailOptions = {
      from: `Next Turn <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate email HTML template
 */
function generateEmailHTML(type, data) {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
      <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  `;
  
  const footer = `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b;">
          <p style="margin: 5px 0;">Next Turn - Smart Queue Management</p>
          <p style="margin: 5px 0; font-size: 12px;">This is an automated notification. Please do not reply.</p>
          <p style="margin: 5px 0; font-size: 12px;"><a href="https://nextturn-three.vercel.app" style="color: #3b82f6;">Visit Dashboard</a></p>
        </div>
      </div>
    </div>
  `;

  if (type === 'queue_joined') {
    return baseStyle + `
      <h1 style="color: #3b82f6; margin-bottom: 20px;">🎟️ You're in the Queue!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        You have successfully joined the queue at <strong>${data.placeName}</strong>.
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0; font-size: 18px;"><strong>Token Number:</strong> <span style="color: #3b82f6; font-size: 24px; font-weight: bold;">${data.token}</span></p>
        <p style="margin: 10px 0;"><strong>Current Position:</strong> ${data.position}</p>
        <p style="margin: 10px 0;"><strong>Estimated Wait Time:</strong> ${data.estimatedTime} minutes</p>
        <p style="margin: 10px 0;"><strong>Priority:</strong> ${data.priorityType === 'normal' ? 'Standard' : data.priorityType.charAt(0).toUpperCase() + data.priorityType.slice(1)}</p>
      </div>
      <p style="font-size: 14px; color: #64748b;">
        We'll notify you when you're next in line. Please stay nearby!
      </p>
    ` + footer;
  }

  if (type === 'your_turn_soon') {
    return baseStyle + `
      <h1 style="color: #f59e0b; margin-bottom: 20px;">⚠️ Your Turn is Coming Up!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 18px; color: #334155; line-height: 1.6; background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <strong>You have ${data.peopleAhead} person(s) ahead of you!</strong>
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Token:</strong> ${data.token}</p>
        <p style="margin: 10px 0;"><strong>Place:</strong> ${data.placeName}</p>
        <p style="margin: 10px 0;"><strong>Estimated Time:</strong> ~${data.estimatedTime} minutes</p>
      </div>
      <p style="font-size: 16px; color: #334155;">
        Please be ready and stay near the service area.
      </p>
    ` + footer;
  }

  if (type === 'your_turn_now') {
    return baseStyle + `
      <h1 style="color: #10b981; margin-bottom: 20px;">✅ It's Your Turn Now!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 20px; color: #334155; line-height: 1.6; background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; text-align: center;">
        <strong>🎉 Please proceed to the counter!</strong>
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 10px 0; font-size: 32px; color: #3b82f6; font-weight: bold;">${data.token}</p>
        <p style="margin: 10px 0;"><strong>${data.placeName}</strong></p>
      </div>
      <p style="font-size: 14px; color: #64748b; text-align: center;">
        Thank you for using Next Turn!
      </p>
    ` + footer;
  }

  return baseStyle + '<p>Notification</p>' + footer;
}

module.exports = {
  sendEmail,
  generateEmailHTML
};
