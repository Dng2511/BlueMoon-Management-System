import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Blue Moon
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Dashboard
            </Button>
          </Link>
          <Link href="/households">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Households
            </Button>
          </Link>
          <Link href="/residents">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Residents
            </Button>
          </Link>
          <Link href="/fees">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Fees
            </Button>
          </Link>
          <Link href="/contributions">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Contributions
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" className="text-white hover:text-blue-700">
              Profile
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
