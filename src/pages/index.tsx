import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Home = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from('menus').select('*').order('name', { ascending: true });

      if (error) console.log('error: ', error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {menus.map((menu: IMenu) => (
          <Card key={menu.id}>
            <CardContent>
              <img src={menu.image} alt={menu.name} width={200} height={200} className="w-full h-[30vh] object-cover rounded-lg" />
              {/* Judul dan harga */}
              <div className="mt-4 flex justify-between">
                <div>
                  <h4 className="font-semibold text-xl">{menu.name}</h4>
                  <p>{menu.category}</p>
                </div>
                <p className="font-semibold text-2xl">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(menu.price)}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/menu/${menu.id}`} className="w-full">
                <Button className="w-full font-bold" size="lg">Detail Menu</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;