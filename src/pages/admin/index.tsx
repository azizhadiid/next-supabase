import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/lib/db";
import type { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPage() {
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedMenu, setSelectedMenu] = useState<{
        menu: IMenu;
        action: 'edit' | 'delete';
    } | null>(null);

    const categories = [
        "Makanan Berat",
        "Minuman",
        "Snack",
        "Dessert",
        "Appetizer",
    ];

    useEffect(() => {
        const fetchMenus = async () => {
            const { data, error } = await supabase.from('menus').select('*');

            if (error) console.log('error: ', error);
            else setMenus(data);
        };

        fetchMenus();
    }, [supabase]);

    const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const { data, error } = await supabase
                .from('menus')
                .insert(Object.fromEntries(formData))
                .select();

            if (error) console.log('error: ', error);
            else {
                if (data) {
                    setMenus((prev) => [...data, ...prev]);
                }
                toast('Menu Succes Added!');
                setCreateDialog(false);
            }
        } catch (error) {
            if (error) console.log('error: ', error);
        }
    };

    const handleDeleteMenu = async () => {
        try {
            const { data, error } = await supabase
                .from('menus')
                .delete()
                .eq('id', selectedMenu?.menu.id);

            if (error) console.log('error: ', error);
            else {
                setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenu?.menu.id));
                toast('Menu Succes Deleted!');
                setSelectedMenu(null);
            }
        } catch (error) {
            if (error) console.log('error: ', error);
        }
    };

    // Kode yang benar
    const handleEditMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const { error } = await supabase
                .from('menus')
                .update(Object.fromEntries(formData))
                .eq('id', selectedMenu?.menu.id);

            if (error) {
                console.log('error: ', error);
            } else {
                setMenus((prev) => prev.map((menu) => menu.id === selectedMenu?.menu.id ? { ...menu, ...Object.fromEntries(formData) } : menu));
                toast('Menu Succes Edited!');
                setSelectedMenu(null);
            }
        } catch (error) {
            if (error) console.log('error: ', error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="font-bold">Add Menu</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleAddMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Menu</DialogTitle>
                                <DialogDescription>Create a new menu by insert in this form.</DialogDescription>
                            </DialogHeader>

                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name Menu</Label>
                                    <Input id="name" name="name" placeholder="Insert Name" required />
                                </div>

                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price Menu</Label>
                                    <Input id="price" name="price" placeholder="Insert Price" required />
                                </div>

                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image Menu</Label>
                                    <Input id="image" name="image" placeholder="Insert Image" required />
                                </div>

                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Category Menu</Label>
                                    <Select onValueChange={setSelectedCategory} value={selectedCategory} name="category" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih kategori menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description Menu</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter menu description here..."
                                        required
                                        className="resize-none h-32"
                                    />
                                </div>

                                <DialogFooter>
                                    {/* Tombol untuk menutup dialog tanpa aksi */}
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary" className="cursor-pointer">
                                            Close
                                        </Button>
                                    </DialogClose>

                                    {/* Tombol untuk melakukan aksi utama (misalnya, menyimpan) */}
                                    <Button type="submit" className="cursor-pointer">Submit</Button>
                                </DialogFooter>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
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
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(menu.price)}
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
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedMenu({ menu, action: 'edit' })
                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400" onClick={() => {
                                                    setSelectedMenu({ menu, action: 'delete' })
                                                }}>Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={selectedMenu !== null && selectedMenu.action === 'delete'} onOpenChange={(open) => {
                if (!open) {
                    setSelectedMenu(null);
                }
            }}>
                <DialogContent className="sm:max-w-md">

                    <DialogHeader>
                        <DialogTitle>Delete Menu</DialogTitle>
                        <DialogDescription>Are you sure want to delete {selectedMenu?.menu.name}?</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        {/* Tombol untuk menutup dialog tanpa aksi */}
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="cursor-pointer">
                                Close
                            </Button>
                        </DialogClose>

                        {/* Tombol untuk melakukan aksi utama (misalnya, menyimpan) */}
                        <Button onClick={handleDeleteMenu} className="cursor-pointer" variant={'destructive'}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={selectedMenu !== null && selectedMenu.action === 'edit'} onOpenChange={(open) => {
                if (!open) {
                    setSelectedMenu(null);
                }
            }}>

                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleEditMenu} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit Menu</DialogTitle>
                            <DialogDescription>Update an existing menu item using this form.</DialogDescription>
                        </DialogHeader>

                        <div className="grid w-full gap-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Name Menu</Label>
                                <Input id="name" name="name" placeholder="Insert Name" defaultValue={selectedMenu?.menu.name} />
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="price">Price Menu</Label>
                                <Input id="price" name="price" placeholder="Insert Price" defaultValue={selectedMenu?.menu.price} />
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="image">Image Menu</Label>
                                <Input id="image" name="image" placeholder="Insert Image" defaultValue={selectedMenu?.menu.image} />
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="category">Category Menu</Label>
                                <Select onValueChange={setSelectedCategory} value={selectedCategory} name="category" defaultValue={selectedMenu?.menu.category} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih kategori menu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="description">Description Menu</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter menu description here..."
                                    className="resize-none h-32"
                                    defaultValue={selectedMenu?.menu.description}
                                />
                            </div>

                            <DialogFooter>
                                {/* Tombol untuk menutup dialog tanpa aksi */}
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" className="cursor-pointer">
                                        Close
                                    </Button>
                                </DialogClose>

                                {/* Tombol untuk melakukan aksi utama (misalnya, menyimpan) */}
                                <Button type="submit" className="cursor-pointer">Submit</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
};
