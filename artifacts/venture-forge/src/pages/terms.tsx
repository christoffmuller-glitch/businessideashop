import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 2025</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">1. Agreement to Terms</h2>
            <p>
              By creating an account or using VentureForge ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">2. Description of Service</h2>
            <p>
              VentureForge is a marketplace platform that allows users to share early-stage business ideas,
              discover collaboration opportunities, and connect with potential co-founders, contributors, and investors.
              We facilitate connections — we are not a party to any arrangement made between users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">3. User Accounts</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Providing accurate and complete information when creating your account</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activity that occurs under your account</li>
              <li>Notifying us immediately of any unauthorised use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">4. Content You Submit</h2>
            <p>
              You retain ownership of any intellectual property you submit to VentureForge. By submitting content,
              you grant us a non-exclusive, worldwide, royalty-free licence to display, reproduce, and distribute
              that content as part of operating the Service.
            </p>
            <p className="mt-3">You represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>You own or have rights to the content you submit</li>
              <li>Your content does not infringe any third party's intellectual property rights</li>
              <li>Your content is accurate to the best of your knowledge</li>
              <li>Your content does not contain false, misleading, or fraudulent information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Post false, misleading, or fraudulent content</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Use the Service for illegal purposes</li>
              <li>Attempt to gain unauthorised access to the Service or other users' accounts</li>
              <li>Use automated tools to scrape or harvest data from the Service without our written permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">6. No Financial, Legal, or Investment Advice</h2>
            <p className="font-medium text-foreground">
              VentureForge does not provide financial, legal, investment, or business advice of any kind.
            </p>
            <p className="mt-3">
              Content on the platform represents the personal opinions and ideas of individual users.
              Nothing on VentureForge constitutes an offer to sell or buy securities, an investment recommendation,
              or professional advice of any kind. You should conduct your own due diligence and consult
              qualified professionals before entering into any commercial, legal, or investment arrangement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">7. User Interactions and Arrangements</h2>
            <p>
              VentureForge facilitates connections between users but is not a party to any agreement, arrangement,
              or transaction between users. We accept no liability for the outcome of any collaboration, investment,
              or commercial arrangement between users. You are solely responsible for evaluating other users
              and entering into arrangements at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">8. Intellectual Property</h2>
            <p>
              The VentureForge platform, including its design, code, and branding, is owned by VentureForge
              and is protected by applicable intellectual property laws. You may not copy, modify, or distribute
              any part of the platform without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VENTUREFORGE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE OR FROM ANY ARRANGEMENT
              MADE THROUGH THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">11. Modifications to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify users of material changes by posting
              the updated Terms on this page and updating the "last updated" date. Continued use of the Service
              after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">12. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these Terms
              or for any other reason at our sole discretion. You may also delete your account at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">13. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:
              <br />
              <strong className="text-foreground">legal@ventureforge.io</strong>
            </p>
          </section>

        </div>
      </div>
    </Layout>
  );
}
