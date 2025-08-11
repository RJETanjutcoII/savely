export const revalidate = 60;

import Picked from "./Picked";
import { createClient } from "../utils/supabase/server";

export default async function PickedForYou() {
  const supabase = await createClient();

  const { data: picks, error } = await supabase
    .from("coupons")
    .select("*")
    .limit(3);

  if (error) {
    console.error(error);
  }

  const hasPicks = !!picks && picks.length > 0;

  return (
    <section className="bg-slate-50 pt-10 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-l from-blue-950 to-violet-700 text-transparent bg-clip-text pb-2">
          Picked For You
        </h1>
      </div>

      <div className="items-center flex justify-evenly shrink">
        {hasPicks ? (
          picks!.map((pick) => (
            <Picked
              key={pick.id}
              id={pick.id}
              name={pick.name}
              oldPrice={pick.oldPrice}
              newPrice={pick.newPrice}
              image={pick.imageLink}
            />
          ))
        ) : (
          <>
            <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null" />
            <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null" />
            <Picked name="Loading..." id={0} oldPrice={0} newPrice={0} image="null" />
          </>
        )}
      </div>
    </section>
  );
}
