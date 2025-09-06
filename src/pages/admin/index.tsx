import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
            const { data, error } = await supabase.from('menus').select('*');

            if (error) console.log('error: ', error);
            else setMenus(data);
        };

        fetchMenus();
    }, [supabase]);

    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Button className="font-bold">Add Menu</Button>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Product</TableHead>
                            <TableHead className="font-bold">Description</TableHead>
                            <TableHead className="font-bold">Category</TableHead>
                            <TableHead className="font-bold">Price</TableHead>
                            <TableHead className="font-bold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menus.map((menu: IMenu) => (
                            <TableRow>
                                <TableCell className="flex gap-3 items-center w-full">
                                    <img src={menu.image} alt={menu.name} width={50} height={50} className="aspect-square object-cover rounded-lg" />
                                    {menu.name}
                                </TableCell>
                                <TableCell>
                                    {menu.description.split(' ').slice(0, 5).join(' ') + '...'}
                                </TableCell>
                                <TableCell>
                                    {menu.category}
                                </TableCell>
                                <TableCell>
                                    Rp. {menu.price}.00
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="cursor-pointer">
                                            <Ellipsis />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel className="font-bold">
                                                Action
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Update</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
