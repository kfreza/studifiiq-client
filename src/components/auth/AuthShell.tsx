import Image from "next/image";

export default function Cs_AuthShell({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cs_container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md">
        <h1 className="cs_display text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
        <div className="mt-8">{children}</div>
      </div>

      {/* side photo */}
      <div className="relative hidden aspect-[4/5] max-h-[640px] overflow-hidden rounded-2xl lg:block">
        <Image
          src="https://images.unsplash.com/photo-1786325492057-e45a9aea8c8a?w=1200&q=80&auto=format&fit=crop"
          alt="A quiet photo studio with a director chair, a light and a mirror"
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <p className="absolute right-8 bottom-8 left-8 text-lg leading-7 font-medium text-white">
          Hundreds of hours of studio time go unused every week. Book them, or list yours.
        </p>
      </div>
    </section>
  );
}
