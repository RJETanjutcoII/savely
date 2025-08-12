import Link from "next/link";
import Countdown from "./Countdown"; // client-only countdown

type DealsProps = {
  id: number;
  name: string;
  oldPrice: number;
  newPrice: number;
  image?: string;
  expDate: string;
};

export default function Deals({ id, name, oldPrice, newPrice, image, expDate }: DealsProps) {
  const discount = oldPrice > 0 ? ((1 - newPrice / oldPrice) * 100).toFixed() : "0";

  return (
    <div className="h-90 w-80 items-center text-center">
      <Link href={`products/${id}`}>
        <div className="grid col-start-1 row-start-1">
          <img
            src={image}
            alt={name}
            className="col-start-1 row-start-1 h-60 w-80 object-cover mb-5 rounded-3xl min-w-80"
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
      </Link>

      {/* Client countdown for live ticking */}
      <Countdown expDate={expDate} />

      <button className="px-25 bg-blue-700 rounded-xl text-white py-3 font-bold">
        Add to Cart
      </button>
    </div>
  );
}
