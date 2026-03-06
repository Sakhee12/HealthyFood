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

function ViewCategories() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        parent_id: "",
        status: 1,
        image: null
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllCategories();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
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
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, submissionData);
                alert("Category updated!");
            } else {
                await adminService.addCategory(submissionData);
                alert("Category added!");
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", image_url: "", parent_id: "", status: 1, image: null });
            fetchCategories();
        } catch (error) {
            alert("Error saving category");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || "",
            slug: category.slug || "",
            description: category.description || "",
            image_url: category.image_url || "",
            parent_id: category.parent_id || "",
            status: category.status !== undefined ? category.status : 1,
            image: null
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this category?")) {
            try {
                await adminService.deleteCategory(id);
                fetchCategories();
            } catch (error) {
                alert("Error deleting category");
            }
        }
    };

    const columns = [
        columnHelper.accessor("id", {
            header: () => <p className="text-sm font-bold text-gray-600">ID</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("image_url", {
            header: () => <p className="text-sm font-bold text-gray-600">IMAGE</p>,
            cell: (info) => (
                <div className="flex items-center gap-2">
                    {info.getValue() ? (
                        <img
                            src={info.getValue().startsWith('http') ? info.getValue() : BASE_URL + info.getValue()}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">N/A</div>
                    )}
                </div>
            ),
        }),
        columnHelper.accessor("name", {
            header: () => <p className="text-sm font-bold text-navy-700">NAME</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue()}</p>,
        }),
        columnHelper.accessor("description", {
            header: () => <p className="text-sm font-bold text-gray-600">DESCRIPTION</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 truncate max-w-[200px]">{info.getValue() || "N/A"}</p>,
        }),
        columnHelper.accessor("slug", {
            header: () => <p className="text-sm font-bold text-gray-600">SLUG</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{info.getValue() || "N/A"}</p>,
        }),
        columnHelper.accessor("status", {
            header: () => <p className="text-sm font-bold text-gray-600">STATUS</p>,
            cell: (info) => (
                <p className={`text-sm font-bold ${info.getValue() === 1 ? 'text-green-500' : 'text-red-500'}`}>
                    {info.getValue() === 1 ? 'Active' : 'Inactive'}
                </p>
            ),
        }),
        columnHelper.accessor("updated_at", {
            header: () => <p className="text-sm font-bold text-gray-600">UPDATED AT</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700">{new Date(info.getValue()).toLocaleString()}</p>,
        }),
        columnHelper.display({
            id: "actions",
            header: () => <p className="text-sm font-bold text-gray-600">ACTIONS</p>,
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(info.row.original)} className="text-xl text-brand-500 hover:text-brand-600 transition-all active:scale-95"><MdEdit /></button>
                    <button onClick={() => handleDelete(info.row.original.id)} className="text-xl text-red-500 hover:text-red-600 transition-all active:scale-95"><MdDelete /></button>
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
                    <div className="text-xl font-bold text-navy-700 dark:text-white">Category Management</div>
                    <button
                        onClick={() => { setEditingCategory(null); setFormData({ name: "", slug: "", description: "", image_url: "", parent_id: "", status: 1, image: null }); setShowModal(true); }}
                        className="flex items-center gap-2 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600"
                    >
                        <MdAdd /> Add Category
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
                            {loading ? <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr> :
                                data.length === 0 ? <tr><td colSpan="4" className="text-center py-10">No categories found.</td></tr> :
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
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Name *" id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                    <InputField label="Slug" id="slug" type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Image Upload</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                        />
                                    </div>
                                    <InputField label="Parent ID" id="parent_id" type="number" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-navy-700 dark:text-white ml-3">Status</label>
                                    <select
                                        className="mt-2 flex w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none dark:!border-white/10 dark:text-white dark:bg-navy-900"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
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

export default ViewCategories;
