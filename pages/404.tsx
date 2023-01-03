import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 • Alaina</title>
      </Head>
      <h1 className="container mx-auto p-10 max-w-md">
        <div className="flex flex-col justify-center items-center align-center pt-[20vh] text-center">
          <h1 className="pb-5 text-5xl text-ctp-mauve font-bold font-serif">
            404
          </h1>
          <h3>Oh no! The page you're looking for doesn't exist.</h3>
          <p className="pt-3">
            Click{" "}
            <Link href="/" className="text-ctp-blue underline">
              here
            </Link>{" "}
            to return home.
          </p>
        </div>
      </h1>
    </>
  );
}
