import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        lede={
          <>
            <p>For lessons, performances, collaborations, or academic inquiries.</p>
            <p>
              <a
                href="mailto:davedemotta@gmail.com"
                className="text-accent transition-colors hover:text-foreground"
              >
                davedemotta@gmail.com
              </a>
              <br />
              Oradell, New Jersey
            </p>
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-6 pb-20">
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </>
  );
}
