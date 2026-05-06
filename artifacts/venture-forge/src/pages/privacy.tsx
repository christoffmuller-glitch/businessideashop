import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 2025</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-slate dark:prose-invert">
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">1. Introduction</h2>
            <p>
              VentureForge ("we", "us", or "our") is committed to protecting your personal information and your right to privacy.
              This Privacy Policy explains how we collect, use, and share information about you when you use our platform
              at ventureforge.io (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create an account (name, email address, password)</li>
              <li>Complete your profile (bio, location, skills, areas of interest)</li>
              <li>Submit a business idea</li>
              <li>Post comments or express interest in contributing to an idea</li>
              <li>Vote on or follow ideas</li>
            </ul>
            <p className="mt-3">
              We also automatically collect certain technical information when you use the Service, including IP address,
              browser type, operating system, referring URLs, and activity logs. This information is used solely for
              operating and improving the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and operate the Service</li>
              <li>To authenticate you and manage your account</li>
              <li>To display your public profile, ideas, and activity to other users</li>
              <li>To send you notifications related to your account or activity (if you opt in)</li>
              <li>To improve and develop the platform</li>
              <li>To detect and prevent fraud, abuse, or security incidents</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>With other users, as part of the normal operation of the platform (e.g. your name appears on ideas you submit and comments you post)</li>
              <li>With service providers who assist us in operating the platform, under strict confidentiality obligations</li>
              <li>If required by law, regulation, or valid legal process</li>
              <li>In connection with a merger, acquisition, or sale of all or part of our business (you will be notified in advance)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">5. Idea Visibility</h2>
            <p>
              Ideas submitted as "public" are visible to all visitors, including non-registered users.
              Ideas set to "contributors only" are visible to logged-in users.
              Ideas set to "private" are visible only to you (and platform administrators for moderation purposes).
              You can change the visibility of your ideas at any time by editing them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your account information and submitted content for as long as your account is active.
              If you delete your account, we will remove your personal data within 30 days, except where
              retention is required by law or for legitimate operational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data</li>
              <li>Export a copy of your data</li>
              <li>Object to or restrict certain uses of your data</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us using the details below.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your information against
              unauthorised access, loss, or disclosure. However, no method of transmission over the internet
              is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting
              the new policy on this page and updating the "last updated" date. We encourage you to review this
              policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              <br />
              <strong className="text-foreground">privacy@ventureforge.io</strong>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
