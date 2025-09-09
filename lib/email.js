// Email notification service using Resend
export class EmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    this.baseUrl = "https://api.resend.com";
    this.fromEmail = process.env.FROM_EMAIL;
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email service error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  // Queue-specific email templates
  async sendQueueJoinedEmail({
    to,
    queueName,
    position,
    estimatedWait,
    queueId,
  }) {
    const subject = `You've joined ${queueName} - Position #${position}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Queue Confirmation</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">You're in line! 🎉</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">${queueName}</h3>
            <p style="margin: 10px 0;"><strong>Your Position:</strong> #${position}</p>
            <p style="margin: 10px 0;"><strong>Estimated Wait:</strong> ${estimatedWait}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #1976d2;">
              <strong>💡 Tip:</strong> We'll send you updates as your position changes and when it's almost your turn!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/my-queue" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Queue Status
            </a>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>This is an automated message from Qline. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    const text = `You've joined ${queueName}! You are position #${position} with an estimated wait of ${estimatedWait}.`;

    return this.sendEmail({ to, subject, html, text });
  }

  async sendPositionUpdateEmail({ to, queueName, newPosition, estimatedWait }) {
    const subject = `Queue Update: You're now #${newPosition} in ${queueName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Queue Update</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">You're moving up! 📈</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #667eea; margin-top: 0;">${queueName}</h3>
            <p style="margin: 10px 0;"><strong>New Position:</strong> #${newPosition}</p>
            <p style="margin: 10px 0;"><strong>Estimated Wait:</strong> ${estimatedWait}</p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      html,
      text: `Queue update: You're now #${newPosition} in ${queueName}`,
    });
  }

  async sendYourTurnEmail({ to, queueName, checkInCode }) {
    const subject = `It's your turn! - ${queueName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">It's Your Turn! 🎉</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333;">Please proceed to ${queueName}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #4caf50; margin-top: 0;">Check-in Code</h3>
            <div style="font-size: 32px; font-weight: bold; color: #333; background: #f5f5f5; padding: 15px; border-radius: 8px; letter-spacing: 2px;">
              ${checkInCode}
            </div>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Important:</strong> Please proceed immediately to avoid losing your spot!
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject,
      html,
      text: `It's your turn at ${queueName}! Check-in code: ${checkInCode}`,
    });
  }
}

export const emailService = new EmailService();
