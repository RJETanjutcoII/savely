// components/Deals.tsx (Server Component)
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// client-only timer (avoids hydration issues)
const Countdown = dynamic(() => import("./Countdown"));

type DealsProps = {
  id: number;
  name: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  expDate: string;
};

export default function Deals({ id, name, oldPrice, newPrice, image, expDate }: DealsProps) {
  const discount = oldPrice > 0 ? ((1 - newPrice / oldPrice) * 100).toFixed() : "0";

  return (
    <div className="h-90 w-80 items-center text-center">
      <Link href={`products/${id}`}>
        <div className="grid col-start-1 row-start-1">
          <Image
            src={image}
            alt={name}
            className="col-start-1 row-start-1 h-60 w-80 object-cover mb-5 rounded-3xl min-w-80"
            width={640}
            height={480}
            quality={100}
          />
          <span className="col-start-1 row-start-1 bg-green-400 w-30 h-10 rounded-xl pt-1.5 ml-2 mt-2 text-white text-xl">
            {discount}% off!
          </span>
        </div>

        <div className="font-bold text-4xl">{name}</div>

        <div>
          <span className="line-through">₱{oldPrice}</span>{" "}
          <span className="text-4xl text-green-400 font-bold">₱{newPrice}</span>
        </div>

      <Countdown expDate={expDate} />

      </Link>

    </div>
  );
}
