import Card from "components/card";
import InputField from "components/fields/InputField";
import { useEffect, useState } from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import { adminService, BASE_URL } from "services/api";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function ViewProducts() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        product_name: "",
        category_id: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
        image: null
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllProducts();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                submissionData.append(key, formData[key]);
            }
        });

        try {
            if (editingProduct) {
                await adminService.updateProduct(editingProduct.id, submissionData);
                alert("Product updated!");
            } else {
                await adminService.addProduct(submissionData);
                alert("Product added!");
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ product_name: "", category_id: "", price: "", stock: "", description: "", image_url: "", image: null });
            fetchProducts();
        } catch (error) {
            alert("Error saving product");
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            product_name: product.product_name || "",
            category_id: product.category_id || "",
            price: product.price || "",
            stock: product.stock || "",
            description: product.description || "",
            image_url: product.image_url || "",
            image: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product?")) {
            try {
                await adminService.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                alert("Error deleting product");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("product_name", {
            header: () => <p className="text-sm font-bold text-gray-600">PRODUCT NAME</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    {info.row.original.image_url && (
                        <img src={info.row.original.image_url.startsWith('http') ? info.row.original.image_url : BASE_URL + info.row.original.image_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    )}
                    <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>
                </div>
            ),
        }),
        columnHelper.accessor("category_name", {
            header: () => <p className="text-sm font-bold text-gray-600">CATEGORY</p>,
            cell: (info) => {
                const catName = info.getValue();
                return <p className="text-sm font-bold text-navy-700">{catName || `Cat ID: ${info.row.original.category_id || 'N/A'}`}</p>;
            },
        }),
        columnHelper.accessor("price", {
            header: () => <p className="text-sm font-bold text-gray-600">PRICE</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">${info.getValue()}</p>,
        }),
        columnHelper.accessor("stock", {
            header: () => <p className="text-sm font-bold text-gray-600">STOCK</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(info.row.original)} className="text-xl text-brand-500"><MdEdit /></button>
                    <button onClick={() => handleDelete(info.row.original.id)} className="text-xl text-red-500"><MdDelete /></button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex w-full flex-col gap-5 pt-8">
            <Card extra={"w-full h-full sm:overflow-auto px-6 pb-6"}>
                <header className="relative flex items-center justify-between pt-4">
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Product Management</div>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({ product_name: "", category_id: "", price: "", stock: "", description: "", image_url: "", image: null });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                    >
                        <MdAdd /> Add Product
                    </button>
                </header>

                <div className="mt-8 overflow-x-scroll">
                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                                            <div className="text-xs text-gray-200">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="6" className="text-center py-10">No products found.</td></tr> :
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                            }
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-navy-800">
                            <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <InputField label="Product Name *" id="product_name" type="text" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} required />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Price" id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    <InputField label="Stock" id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Category ID" id="category_id" type="number" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} />
                                    <div>
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Image Upload</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Description</label>
                                    <textarea
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-bold text-navy-700 dark:text-white">Cancel</button>
                                    <button type="submit" className="flex-1 rounded-xl bg-brand-500 py-2 text-sm font-bold text-white">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default ViewProducts;
