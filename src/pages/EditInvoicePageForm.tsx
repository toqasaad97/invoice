import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BtbLogo from "../components/Logo";
import { apiService } from "../services/api";

interface EditInvoiceData {
  invoiceNumber: string;
  invoiceTo: string;
  customer: string;
  company: string;
  address: string;
  phone: string[];
  email: string[];
  hotelName: string;
  hotelAddress: string;
  hotelPhone: string;
  checkInDate: string;
  checkOutDate: string;
  modificationDate: string;
  remainingBalanceDue: string;
  taxInPercent: string;
  totalRooms: string;
  collectedAmount: number;
  currency: string;
  attrition: string;
  cancellation: string;
  cutOffDate: string;
  penaltyFees: string;
  referenceNumber: string;
  items: Array<{
    id: string;
    customer: string;
    description: string;
    dateRange: string;
    roomType: string;
    bedType: string;
    smoking: string;
    breakfast: boolean;
    extras: string;
    nights: number;
    taxAndFees: number;
    averagePrice: number;
    total: number;
    checkInDate: string;
    checkOutDate: string;
  }>;
}

interface ItemFormData {
  id?: string;
  customer: string;
  nights: number;
  averagePrice: number;
  checkInDate: string;
  checkOutDate: string;
  smoking: string;
  breakfast: boolean;
  roomType: string;
  bedType: string;
  extras: string;
}

const EditInvoicePageForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<EditInvoiceData>({
    invoiceNumber: "163654",
    invoiceTo: "Maureen Wardd",
    customer: "Mark Cohen",
    company: "SMRT image",
    address: "1215 Romney Drive, Pasadena, Ca 91105, United States",
    phone: ["313-833-2544"],
    email: ["tylor.garland@boombang.com"],
    hotelName: "Millennium Knickerbocker Chicago",
    hotelAddress: "",
    hotelPhone: "",
    checkInDate: "2025-11-29",
    checkOutDate: "2025-12-04",
    modificationDate: "",
    remainingBalanceDue: "2025-09-08",
    taxInPercent: "29.362",
    totalRooms: "4",
    collectedAmount: 0,
    currency: "usd ($)",
    attrition: "",
    cancellation:
      "For group reservations, an 80% attrition policy applies. This means that up to 20% of th",
    cutOffDate: "",
    penaltyFees: "1",
    referenceNumber: "13201248",
    items: [
      {
        id: "1",
        customer: "Tylor Garland",
        description: "(November 29, 2025 - December 4, 2025)\nNon-Smoking",
        dateRange: "5 nights",
        roomType: "Deluxe",
        bedType: "King",
        smoking: "Non-Smoking",
        breakfast: false,
        extras: "",
        nights: 5,
        taxAndFees: 58.43,
        averagePrice: 199.0,
        total: 1287.15,
        checkInDate: "2025-11-29",
        checkOutDate: "2025-12-04",
      },
    ],
  });

  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<ItemFormData | null>(
    null
  );
  const [newItemData, setNewItemData] = useState<ItemFormData>({
    customer: "",
    nights: 1,
    averagePrice: 0,
    checkInDate: "",
    checkOutDate: "",
    smoking: "Non-Smoking",
    breakfast: false,
    roomType: "",
    bedType: "",
    extras: "",
  });

  useEffect(() => {
    const loadInvoiceData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        if (!apiService.isAuthenticated()) {
          navigate("/");
          return;
        }

        const response = (await apiService.getInvoice(id)).data;

        // Transform API response to match our form data structure
        setFormData({
          invoiceNumber: response.invoiceNumber || "",
          invoiceTo: response.invoiceTo || "",
          customer: response.customer || "",
          company: response.company || "",
          address: response.address || "",
          phone: response.phone || [],
          email: response.email || [],
          hotelName: response.hotelName || "",
          hotelAddress: response.hotelAddress || "",
          hotelPhone: response.hotelPhone || "",
          checkInDate: response.checkInDate || "",
          checkOutDate: response.checkOutDate || "",
          modificationDate: response.modificationDate || "",
          remainingBalanceDue: response.remainingBalanceDue || "",
          taxInPercent: response.taxInPrecent?.toString() || "",
          totalRooms: response.totalRooms?.toString() || "",
          collectedAmount: response.collectedAmount || 0,
          attrition: response.attrition || "",
          cancellation: response.cancellation || "",
          cutOffDate: response.cutOffDate || "",
          penaltyFees: response.penaltyFees?.toString() || "",
          referenceNumber: response.referenceNumber || "",
          currency: response.currency || "usd ($)",
          items: transformApiItemsToFormItems(response.table || []),
        });
      } catch (err) {
        console.error("Error loading invoice:", err);
        alert(err instanceof Error ? err.message : "Failed to load invoice");

        if (err instanceof Error && err.message.includes("401")) {
          apiService.clearToken();
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoiceData();
  }, [id, navigate]);

  const transformApiItemsToFormItems = (
    apiItems: Array<{
      guestName?: string;
      nights?: number;
      average?: number;
      checkInDate?: string;
      checkOutDate?: string;
      smoking?: string;
      breakfast?: boolean;
      roomType?: string;
      bedType?: string;
      extras?: string;
    }>
  ) => {
    return apiItems.map((item, index) => ({
      id: index.toString(),
      customer: item.guestName || "",
      nights: item.nights || 1,
      averagePrice: item.average || 0,
      taxAndFees: 0, // This might need calculation based on your business logic
      total: (item.nights || 1) * (item.average || 0),
      checkInDate: item.checkInDate || "",
      checkOutDate: item.checkOutDate || "",
      smoking: item.smoking || "Non-Smoking",
      breakfast: item.breakfast || false,
      roomType: item.roomType || "",
      bedType: item.bedType || "",
      extras: item.extras || "",
      dateRange: `${item.nights || 1} nights`,
      description: `(${item.checkInDate || ""} - ${item.checkOutDate || ""})\n${
        item.smoking || ""
      }${item.breakfast ? "\nBreakfast included" : ""}`,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const handleInputChange = (
    field: keyof EditInvoiceData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addPhone = () => {
    if (newPhone.trim()) {
      setFormData((prev) => ({
        ...prev,
        phone: [...prev.phone, newPhone.trim()],
      }));
      setNewPhone("");
    }
  };

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      phone: prev.phone.filter((_, i) => i !== index),
    }));
  };

  const addEmail = () => {
    if (newEmail.trim()) {
      setFormData((prev) => ({
        ...prev,
        email: [...prev.email, newEmail.trim()],
      }));
      setNewEmail("");
    }
  };

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email.filter((_, i) => i !== index),
    }));
  };

  // Modal handlers
  const openEditModal = (itemId: string) => {
    const item = formData.items.find((i) => i.id === itemId);
    if (item) {
      setCurrentEditItem({
        id: item.id,
        customer: item.customer,
        nights: item.nights,
        averagePrice: item.averagePrice,
        checkInDate: item.checkInDate,
        checkOutDate: item.checkOutDate,
        smoking: item.smoking,
        breakfast: item.breakfast,
        roomType: item.roomType,
        bedType: item.bedType,
        extras: item.extras,
      });
      setIsEditModalOpen(true);
    }
  };

  const openAddModal = () => {
    setNewItemData({
      customer: "",
      nights: 1,
      averagePrice: 0,
      checkInDate: "",
      checkOutDate: "",
      smoking: "Non-Smoking",
      breakfast: false,
      roomType: "",
      bedType: "",
      extras: "",
    });
    setIsAddModalOpen(true);
  };

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setCurrentEditItem(null);
  };

  const handleEditItem = (itemFormData: ItemFormData) => {
    if (currentEditItem?.id) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === currentEditItem.id
            ? {
                ...item,
                customer: itemFormData.customer,
                nights: itemFormData.nights,
                averagePrice: itemFormData.averagePrice,
                checkInDate: itemFormData.checkInDate,
                checkOutDate: itemFormData.checkOutDate,
                smoking: itemFormData.smoking,
                breakfast: itemFormData.breakfast,
                roomType: itemFormData.roomType,
                bedType: itemFormData.bedType,
                extras: itemFormData.extras,
                total: itemFormData.nights * itemFormData.averagePrice,
                description: `(${itemFormData.checkInDate} - ${itemFormData.checkOutDate})\n${itemFormData.smoking}`,
                dateRange: `${itemFormData.nights} nights`,
              }
            : item
        ),
      }));
    }
    closeModals();
  };

  const handleAddItem = (itemFormData: ItemFormData) => {
    const newItem = {
      id: Date.now().toString(),
      customer: itemFormData.customer,
      nights: itemFormData.nights,
      averagePrice: itemFormData.averagePrice,
      checkInDate: itemFormData.checkInDate,
      checkOutDate: itemFormData.checkOutDate,
      smoking: itemFormData.smoking,
      breakfast: itemFormData.breakfast,
      roomType: itemFormData.roomType,
      bedType: itemFormData.bedType,
      extras: itemFormData.extras,
      total: itemFormData.nights * itemFormData.averagePrice,
      description: `(${itemFormData.checkInDate} - ${itemFormData.checkOutDate})\n${itemFormData.smoking}`,
      dateRange: `${itemFormData.nights} nights`,
      taxAndFees: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    closeModals();
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const duplicateItem = (itemId: string) => {
    const itemToDuplicate = formData.items.find((item) => item.id === itemId);
    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        id: Date.now().toString(),
      };
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, duplicatedItem],
      }));
    }
  };

  const handleSave = async () => {
    if (!id) {
      alert("Invoice ID not found");
      return;
    }

    try {
      setIsLoading(true);

      // Transform form data to API format
      const apiData = {
        invoiceNumber: formData.invoiceNumber,
        invoiceTo: formData.invoiceTo,
        customer: formData.customer,
        company: formData.company,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        hotelName: formData.hotelName,
        hotelAddress: formData.hotelAddress,
        hotelPhone: formData.hotelPhone,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        modificationDate: formData.modificationDate,
        remainingBalanceDue: formData.remainingBalanceDue,
        taxInPrecent: parseFloat(formData.taxInPercent) || 0,
        totalRooms: parseInt(formData.totalRooms) || 0,
        totalNights: formData.items.reduce((sum, item) => sum + item.nights, 0),
        collectedAmount: formData.collectedAmount,
        refundAmount: 0, // This might need to be calculated
        penaltyFees: parseFloat(formData.penaltyFees) || 0,
        penaltyFeesName: "Penalty Fee", // Default name
        currency: formData.currency.split(" ")[0].toUpperCase(),
        referenceNumber: formData.referenceNumber,
        attrition: formData.attrition,
        cancellation: formData.cancellation,
        cutOffDate: formData.cutOffDate,
        hotelCheckOut: formData.checkOutDate,
        hotelCheckIn: formData.checkInDate,
        numberOfAdults: 1, // Default value - might need to be added to form
        creditCard: "", // Default value - might need to be added to form
        deposit: false, // Default value - might need to be added to form
        table: formData.items.map((item) => ({
          nights: item.nights,
          average: item.averagePrice,
          guestName: item.customer,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          smoking: item.smoking,
          breakfast: item.breakfast,
          roomType: item.roomType,
          bedType: item.bedType,
          extras: item.extras,
        })),
      };

      await apiService.editInvoice(id, apiData);
      alert("Invoice updated successfully!");

      // Optionally redirect to detail page
      navigate(`/reservation/${id}`);
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert(err instanceof Error ? err.message : "Failed to save invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const penaltyFees = parseFloat(formData.penaltyFees) || 0;
    const collectedAmount = formData.collectedAmount || 0;
    const refundAmount = 0;
    const remainingBalance =
      subtotal + penaltyFees - collectedAmount - refundAmount;

    return {
      subtotal,
      penaltyFees,
      collectedAmount,
      refundAmount,
      remainingBalance,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a75d4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  // Item Modal Component
  const ItemModal: React.FC<{
    isOpen: boolean;
    title: string;
    initialData: ItemFormData;
    onSave: (data: ItemFormData) => void;
    onClose: () => void;
  }> = ({ isOpen, title, initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState<ItemFormData>(initialData);

    useEffect(() => {
      setFormData(initialData);
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    const handleInputChange = (
      field: keyof ItemFormData,
      value: string | number | boolean
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="text-center py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 text-[#5a75d4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {title}
            </h2>
          </div>

          {/* Modal Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Number of Nights & Average Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Number of Nights
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.nights}
                  onChange={(e) =>
                    handleInputChange("nights", parseInt(e.target.value) || 1)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                />
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-600 mb-2">
                  Average Price Per Night
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averagePrice}
                  onChange={(e) =>
                    handleInputChange(
                      "averagePrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Guest Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Guest Name
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                placeholder="Guest Name"
              />
            </div>

            {/* Check In/Out Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#5a75d4] mb-2">
                  Check In Date
                </label>
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) =>
                    handleInputChange("checkInDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a75d4] mb-2">
                  Check Out Date
                </label>
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) =>
                    handleInputChange("checkOutDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                />
              </div>
            </div>

            {/* Smoking preference and Breakfast */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="smoking"
                    value="Smoking"
                    checked={formData.smoking === "Smoking"}
                    onChange={(e) =>
                      handleInputChange("smoking", e.target.value)
                    }
                    className="mr-2 text-[#5a75d4] focus:ring-[#5a75d4]"
                  />
                  <span className="text-sm">Smoking</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="smoking"
                    value="Non-Smoking"
                    checked={formData.smoking === "Non-Smoking"}
                    onChange={(e) =>
                      handleInputChange("smoking", e.target.value)
                    }
                    className="mr-2 text-[#5a75d4] focus:ring-[#5a75d4]"
                  />
                  <span className="text-sm">Non-Smoking</span>
                </label>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.breakfast}
                  onChange={(e) =>
                    handleInputChange("breakfast", e.target.checked)
                  }
                  className="mr-2 text-[#5a75d4] focus:ring-[#5a75d4] rounded"
                />
                <span className="text-sm">Breakfast</span>
              </label>
            </div>

            {/* Room and Bed Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Choose Room Type
                </label>
                <select
                  value={formData.roomType}
                  onChange={(e) =>
                    handleInputChange("roomType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                >
                  <option value="">Choose Room Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Presidential">Presidential</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Choose Bed Type
                </label>
                <select
                  value={formData.bedType}
                  onChange={(e) => handleInputChange("bedType", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                >
                  <option value="">Choose Bed Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                </select>
              </div>
            </div>

            {/* Extras */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Extras
              </label>
              <textarea
                value={formData.extras}
                onChange={(e) => handleInputChange("extras", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                rows={3}
                placeholder="Any additional requirements or notes..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-[#5a75d4] hover:bg-[#4a65c4] text-white rounded-md transition-colors"
              >
                {title.includes("Edit") ? "Edit" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <BtbLogo width={40} height={40} className="mr-3" />
            <span className="text-xl font-semibold text-[#5a75d4]">
              Invoices
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/home")}
              className="px-4 py-2 bg-[#5a75d4] hover:bg-[#4a65c4] text-white rounded-md transition-colors flex items-center text-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back Home
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#5a75d4] hover:bg-[#4a65c4] text-white rounded-md transition-colors flex items-center text-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="text-center py-8 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-2 text-[#5a75d4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit invoice
            </h1>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      handleInputChange("invoiceNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Customer
                  </label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) =>
                      handleInputChange("customer", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    rows={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Phone
                  </label>
                  <div className="space-y-2">
                    {formData.phone.map((phone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="bg-[#5a75d4] text-white px-3 py-1 rounded-full text-sm flex items-center">
                          {phone}
                          <button
                            onClick={() => removePhone(index)}
                            className="ml-2 hover:bg-[#4a65c4] rounded-full p-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addPhone()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                        placeholder="Add new phone"
                      />
                      <button
                        onClick={addPhone}
                        className="p-2 bg-[#5a75d4] text-white rounded-md hover:bg-[#4a65c4] transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    value={formData.hotelName}
                    onChange={(e) =>
                      handleInputChange("hotelName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Hotel Address
                  </label>
                  <input
                    type="text"
                    value={formData.hotelAddress}
                    onChange={(e) =>
                      handleInputChange("hotelAddress", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      <span className="text-[#5a75d4]">Check In Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) =>
                        handleInputChange("checkInDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      <span className="text-[#5a75d4]">Check Out Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) =>
                        handleInputChange("checkOutDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      <span className="text-[#5a75d4]">Modification Date</span>
                    </label>
                    <input
                      type="text"
                      value={formData.modificationDate}
                      onChange={(e) =>
                        handleInputChange("modificationDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      <span className="text-[#5a75d4]">
                        Remaining Balance Due
                      </span>
                    </label>
                    <input
                      type="date"
                      value={formData.remainingBalanceDue}
                      onChange={(e) =>
                        handleInputChange("remainingBalanceDue", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Tax In Precent Per Night
                    </label>
                    <input
                      type="text"
                      value={formData.taxInPercent}
                      onChange={(e) =>
                        handleInputChange("taxInPercent", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Total Rooms
                    </label>
                    <input
                      type="text"
                      value={formData.totalRooms}
                      onChange={(e) =>
                        handleInputChange("totalRooms", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Invoice To
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceTo}
                    onChange={(e) =>
                      handleInputChange("invoiceTo", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Email
                  </label>
                  <div className="space-y-2">
                    {formData.email.map((email, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="bg-[#5a75d4] text-white px-3 py-1 rounded-full text-sm flex items-center">
                          {email}
                          <button
                            onClick={() => removeEmail(index)}
                            className="ml-2 hover:bg-[#4a65c4] rounded-full p-1"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addEmail()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                        placeholder="Add new email"
                      />
                      <button
                        onClick={addEmail}
                        className="p-2 bg-[#5a75d4] text-white rounded-md hover:bg-[#4a65c4] transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Hotel Phone
                  </label>
                  <input
                    type="text"
                    value={formData.hotelPhone}
                    onChange={(e) =>
                      handleInputChange("hotelPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Collected Amount
                  </label>
                  <input
                    type="number"
                    value={formData.collectedAmount}
                    onChange={(e) =>
                      handleInputChange(
                        "collectedAmount",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Attrition
                  </label>
                  <textarea
                    value={formData.attrition}
                    onChange={(e) =>
                      handleInputChange("attrition", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    rows={1}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    <span className="text-[#5a75d4]">Cut Off Date</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cutOffDate}
                    onChange={(e) =>
                      handleInputChange("cutOffDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Penalty Fees
                  </label>
                  <select
                    value={formData.penaltyFees}
                    onChange={(e) =>
                      handleInputChange("penaltyFees", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                  >
                    <option value="">Select penalty fees</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Penalty Fees
                    </label>
                    <input
                      type="text"
                      value={formData.penaltyFees}
                      onChange={(e) =>
                        handleInputChange("penaltyFees", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={formData.referenceNumber}
                      onChange={(e) =>
                        handleInputChange("referenceNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Cancellation
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent mb-4"
                  >
                    <option value="usd ($)">usd ($)</option>
                    <option value="eur (€)">eur (€)</option>
                    <option value="gbp (£)">gbp (£)</option>
                  </select>
                  <textarea
                    value={formData.cancellation}
                    onChange={(e) =>
                      handleInputChange("cancellation", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a75d4] focus:border-transparent"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-8">
              <div className="bg-[#5a75d4] text-white">
                <div className="grid grid-cols-6 gap-4 px-4 py-3 font-medium text-sm">
                  <div>Items</div>
                  <div>Description</div>
                  <div>Tax & Fees Per Night</div>
                  <div>Average Price Per Night</div>
                  <div>Total</div>
                  <div>Action</div>
                </div>
              </div>

              {formData.items.map((item) => (
                <div
                  key={item.id}
                  className="border-l border-r border-b border-gray-200"
                >
                  <div className="grid grid-cols-6 gap-4 px-4 py-4">
                    <div className="text-center">
                      <div className="font-medium">{item.customer}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.nights} nights
                      </div>
                    </div>
                    <div className="text-center">
                      <p>{item.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        $
                        <span className=" text-gray-600">
                          {item.taxAndFees}
                        </span>
                      </div>{" "}
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        $
                        <span className=" text-gray-600">
                          {item.averagePrice}
                        </span>
                      </div>
                    </div>
                    <div className="text-center font-medium">
                      $ {item.total.toFixed(2)}
                    </div>
                    <div className="text-center flex items-center justify-center space-x-1">
                      <button
                        onClick={() => duplicateItem(item.id)}
                        className="p-1 text-[#5a75d4] hover:bg-gray-100 rounded"
                        title="Duplicate"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => openEditModal(item.id)}
                        className="p-1 text-[#5a75d4] hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Item Button */}
              <div className="border-l border-r border-b border-gray-200 p-4">
                <button
                  onClick={openAddModal}
                  className="text-[#5a75d4] hover:bg-gray-50 px-4 py-2 rounded-md border border-[#5a75d4] transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Item
                </button>
              </div>

              {/* Totals */}
              <div className="border border-gray-200 bg-gray-50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Penalty Fees</span>
                  <span>$ {totals.penaltyFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Collected Amount</span>
                  <span>{totals.collectedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Refund Amount</span>
                  <span>{totals.refundAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Remaining Balance</span>
                  <span>$ {totals.remainingBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8">
              <button
                onClick={handleSave}
                className="w-full py-3 bg-[#5a75d4] hover:bg-[#4a65c4] text-white rounded-md transition-colors font-medium text-lg"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Item Modal */}
      <ItemModal
        isOpen={isAddModalOpen}
        title="Add New Item"
        initialData={newItemData}
        onSave={handleAddItem}
        onClose={closeModals}
      />

      <ItemModal
        isOpen={isEditModalOpen}
        title="Edit Item"
        initialData={currentEditItem || newItemData}
        onSave={handleEditItem}
        onClose={closeModals}
      />
    </div>
  );
};

export default EditInvoicePageForm;
