import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
  <div className="container mx-auto px-4 py-12">

    <div className="flex flex-col items-center text-center">
      <Link href="/" className="flex items-center space-x-2 mb-4">
        <div className="flex items-center space-x-1">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 font-momo text-6xl italic font-extrabold leading-none">
            Q
          </span>
          <p className="text-black dark:text-white text-3xl font-semibold leading-none mt-9">
            line
          </p>
        </div>
      </Link>

      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        AI powered queue management for modern businesses.
      </p>
    </div>

    <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Ayothega.</p>
    </div>

  </div>
</footer>
  );
}
