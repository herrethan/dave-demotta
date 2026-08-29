import type { Metadata } from "next";
import Blurb from "@/components/Blurb";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { getPage } from "@/lib/pages";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const page = await getPage("contact");
  const isLocal = typeof page.blurb === "string";
  return (
    <>
      <PageHeader
        title={page.title}
        lede={
          <>
            <Blurb content={page.blurb} />
            {isLocal && (
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
            )}
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
