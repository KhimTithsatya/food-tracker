import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="p-6">
      <Navbar />
      <h1 className="text-3xl font-bold">Food Tracker</h1>
      <p className="text-gray-600">Track food without calories</p>
    </main>
  );
}
