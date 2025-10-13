import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

const AdminLogin = () => {

    const navigate = useNavigate();
    const { adminLogin, isAdminLoading, adminError, checkAdminAuth } = useAdminAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await adminLogin(formData.email, formData.password);
            toast.success("Login successful!");
            // Navigate to admin dashboard with dynamic route
            navigate(`/admin/${response.admin._id}/${encodeURIComponent(response.admin.email)}`);
        } catch (error) {
            toast.error(error.message || "Login failed");
        }
    };

    useEffect(() => {
        document.title = "Admin Login | UniEvent";
    }, []);

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm mt-10">

                <div className={cn("flex flex-col gap-6")}>

                    <div className="flex flex-col gap-6">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <h1 className="text-2xl font-bold">Welcome back Admin</h1>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isAdminLoading}
                                    >
                                        {isAdminLoading ? "Logging in..." : "Login"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin