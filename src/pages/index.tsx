import Head from "next/head";
import Link from "next/link";
import GitHub from "../components/GitHub";
import Mastodon from "../components/Mastodon";

export default function Home() {
  return (
    <>
      <Head>
        <title>~ • Alaina</title>
      </Head>
      <h1 className="container mx-auto p-10 max-w-screen-md">
        <div className="flex flex-col justify-center items-center align-center pt-[20vh]">
          <figure className="aspect-square">
            <img
              className="rounded-full"
              alt="Alaina"
              src="https://avatars.githubusercontent.com/u/68250402?v=4"
              width="120"
              height="120"
            />
          </figure>
          <div className="text-center pt-4 max-w-md">
            <h1 className="pb-2 text-3xl text-ctp-mauve font-bold font-serif">
              Alaina
            </h1>
            <h3 className="text-xl font-medium text-ctp-subtext-1">
              @alaidriel
            </h3>
            <div className="pt-2 text-md text-ctp-subtext0 leading-7">
              Hi! I'm Alaina, or Aly (she/her 🏳️‍⚧️), an aspiring cs student with a passion for programming. I have a small blog <Link href="/posts" className="text-ctp-blue underline">here</Link>.
            </div>
          </div>
          <div className="flex flex-row space-x-3 pt-4">
            <a
              href="https://github.com/alaidriel"
              className="rounded-md bg-ctp-surface0 transition-all p-1 pt-[7px] w-10 h-10 hover:bg-ctp-overlay0 text-center"
              aria-label="GitHub"
              target="_blank"
            >
              <GitHub />
            </a>
            <a
              href="https://tech.lgbt/@alyaura"
              className="rounded-md bg-ctp-surface0 transition-all p-1 pt-[7px] w-10 h-10 hover:bg-ctp-overlay0 text-center"
              aria-label="Mastodon"
              target="_blank"
            >
              <Mastodon />
            </a>
          </div>
        </div>
      </h1>
    </>
  );
}
