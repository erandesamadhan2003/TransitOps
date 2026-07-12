import cron from 'node-cron';
import nodemailer from 'nodemailer';
import * as driversModel from '../modules/drivers/drivers.model.js';

export const startCronJobs = () => {
    // Run daily at 00:00
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running daily license-expiry reminder job...');
            const expiringDrivers = await driversModel.findExpiringLicenses(30);
            
            if (!expiringDrivers || expiringDrivers.length === 0) {
                console.log('No drivers with licenses expiring in the next 30 days.');
                return;
            }

            const messageBody = expiringDrivers.map(d => 
                `- ${d.name} (License: ${d.licenseNumber}) expires on ${new Date(d.licenseExpiry).toLocaleDateString()}`
            ).join('\n');

            const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

            if (hasSmtpConfig) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT || 587,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                await transporter.sendMail({
                    from: '"TransitOps System" <noreply@transitops.com>',
                    to: process.env.SAFETY_OFFICER_EMAIL || 'admin@transitops.com',
                    subject: 'Daily Alert: Expiring Driver Licenses',
                    text: `The following drivers have licenses expiring within 30 days:\n\n${messageBody}`
                });
                console.log(`Sent license expiry reminder email for ${expiringDrivers.length} drivers.`);
            } else {
                console.info(`[REMINDER - NO SMTP CONFIGURED] The following drivers have licenses expiring within 30 days:\n${messageBody}`);
            }
        } catch (error) {
            console.error('Error running license-expiry cron job:', error);
        }
    });
};
