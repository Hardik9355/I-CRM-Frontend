import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import InvoiceDrawer from "./InvoiceDrawer";
import { MdDelete } from "react-icons/md";
import { useAuthContext } from "hooks/useAuthContext";
import Spinner from "./Spinner";
import DeleteInvoiceConfirm from "./DeleteInvoiceConfirm";

const InvoiceTable = () => {
  const [filter, setFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [data, setData] = useState([
    { id: 1, task: "Task 1", completed: false },
    { id: 2, task: "Task 2", completed: false },
    { id: 3, task: "Task 3", completed: true },
    { id: 4, task: "Task 4", completed: false },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientData, setClientData] = useState([]);
  const [itemsPerPage] = useState(5);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [spin, setSpin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [managers, setManagers] = useState([]);
  const [clientIds, setClientIds] = useState([]);
  const [selectedClientID, setSelectedClientID] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [updated, setUpdated] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuthContext();

  const initialFormData = {
    clientId: "",
    projectId: "",
    number: "",
    poNumber: "",
    date: "",
    serviceFromDate: "",
    serviceToDate: "",
    mileStones: [],
    dueDate: "",
    preparedBy: "",
    reviewedBy: [],

    services: [
      {
        name: "",
        description: "",
        // fromDate: "",
        // toDate: "",
        mileStone: "",
        hours: "",
        rate: "",
        discountPercent: "",
        discountAmount: "",
        SAC: "998311",
        timeTrackerReportUrl: "",
        taxableAmount: "",
        sgstRate: "Nil",
        sgstAmount: "",
        cgstRate: "Nil",
        cgstAmount: "",
        igstRate: "Nil",
        igstAmount: "",
      },
    ],
    adjustments: [
      {
        name: "",
        amount: "",
      },
    ],
    status: "DRAFT",
    paidAmount: "",
    forgivenAmount: "",
    paidAmountINR: "",
    forgivenReason: "",
    cancellationReason: "",
    paymentChannel: "WISE",
    lostAmountINR: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (id) => {
    setData(
      data.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
    setIsOpen(false);
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = formData.services.map((service, i) => {
      if (i === index) {
        return { ...service, [field]: value };
      }
      return service;
    });
    setFormData({ ...formData, services: updatedServices });
  };

  const handleAdjustmentChange = (index, field, value) => {
    const updatedAdjustements = formData.adjustments.map((adjustment, i) => {
      if (i === index) {
        return { ...adjustment, [field]: value };
      }
      return adjustment;
    });
    setFormData({ ...formData, adjustments: updatedAdjustements });
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setIsOpen(true);
  };

  const handleDeleteClick = (event, id) => {
    event.preventDefault();
    setDeleteId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    handleDeleteRow(deleteId);
    setShowModal(false);
    setDeleteId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    setSpin(true);
    event.preventDefault();
    console.log(formData);

    // Send data to the API endpoint
    fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setIsDrawerOpen(false);
        setSubmitted((prevSubmitted) => !prevSubmitted);
        setSpin(false);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/client/`)
      .then((response) => response.json())
      .then((data) => {
        setClients(data.data.clients);
      })
      .catch((error) => {
        console.error("Failed to fetch clients", error);
      });
  }, []);

  useEffect(() => {
    setSpin(true);
    fetch(`${process.env.REACT_APP_API_URL}/invoices`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data.data.invoices);
        setSpin(false); // Assuming the API returns invoices in data.data.invoices
      })
      .catch((error) => {
        console.error("Failed to fetch invoices", error);
      });
  }, [deleted, submitted]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/project/`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(data.data.projects);
        console.log(projects);
      })
      .catch((error) => {
        console.error("Failed to fetch projects", error);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/people/`)
      .then((response) => response.json())
      .then((data) => {
        setPeople(data.data.people);

        setManagers(
          data.data.people.filter(
            (person) => person.department === "Engineering"
          )
        );
      })
      .catch((error) => {
        console.error("Failed to fetch people", error);
      });
  }, []);

  const handleDeleteRow = (id) => {
    setSpin(true);
    fetch(`${process.env.REACT_APP_API_URL}/invoices/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete row");
        }
        setInvoices((prevData) => prevData.filter((row) => row.id !== id));
        setDeleted((prevDeleted) => !prevDeleted);
        setSpin(false);
      })
      .catch((error) => console.error("Error deleting row:", error));
  };

  const handleClientSelect = (clientID) => {
    setSelectedClientID(clientID);
  };

  const handleClientChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // This sets the clientId to the selected option's value, which is the ObjectId
    }));
  };

  const handleUpdateDrawerToggle = () => {
    setIsUpdateDrawerOpen(!isUpdateDrawerOpen);
  };

  const [selectedId, setSelectedId] = useState(null);

  const [idData, setIdData] = useState({
    clientId: "",
    projectId: "",
    number: "",
    poNumber: "",
    date: "",
    serviceFromDate: "",
    serviceToDate: "",
    // mileStones: "",
    dueDate: "",
    preparedBy: "",
    reviewedBy: "",

    services: [
      {
        name: "",
        description: "",
        hours: "",
        rate: "",
        mileStone: "",
        discountPercent: "",
        discountAmount: "",
        SAC: "998311",
        timeTrackerReportUrl: "",
        taxableAmount: "",
        sgstRate: "Nil",
        sgstAmount: "",
        cgstRate: "Nil",
        cgstAmount: "",
        igstRate: "Nil",
        igstAmount: "",
      },
    ],
    adjustments: [
      {
        name: "",
        amount: "",
      },
    ],
    status: "DRAFT",
    paidAmount: "",
    forgivenAmount: "",
    paidAmountINR: "",
    forgivenReason: "",
    cancellationReason: "",
    paymentChannel: "WISE",
  });

  const handleUpdate = async (event, id) => {
    event.preventDefault();
    try {
      const response = await fetch();
      // `https://i-crm-backend-6fqp.onrender.com/invoices/${id}`
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setIdData({
        clientId: data.clientId || "",
        projectId: data.projectId || "",
        serialNumber: data.serialNumber || "",
        number: data.number || "",
        poNumber: data.poNumber || "",
        date: data.date || "",
        serviceFromDate: data.serviceFromDate || "",
        serviceToDate: data.serviceToDate || "",
        mileStones: data.mileStones || "",
        serviceDays: data.serviceDays || "",
        dueDate: data.dueDate || "",
        preparedBy: data.preparedBy || "",
        reviewedBy: data.reviewedBy || "",

        services: [
          {
            name: data.services?.[0]?.name || "",
            description: data.services?.[0]?.description || "",
            hours: data.services?.[0]?.hours || "",
            rate: data.services?.[0]?.rate || "",
            mileStone: data.services?.[0]?.mileStone || "",
            discountPercent: data.services?.[0]?.discountPercent || "",
            discountAmount: data.services?.[0]?.discountAmount || "",
            SAC: data.services?.[0]?.SAC || "998311",
            timeTrackerReportUrl:
              data.services?.[0]?.timeTrackerReportUrl || "",
            taxableAmount: data.services?.[0]?.taxableAmount || "",
            sgstRate: data.services?.[0]?.sgstRate || "Nil",
            sgstAmount: data.services?.[0]?.sgstAmount || "",
            cgstRate: data.services?.[0]?.cgstRate || "Nil",
            cgstAmount: data.services?.[0]?.cgstAmount || "",
            igstRate: data.services?.[0]?.igstRate || "Nil",
            igstAmount: data.services?.[0]?.igstAmount || "",
          },
        ],
        adjustments: data.adjustments || [
          {
            name: data.adjustments?.[0]?.name || "",
            amount: data.adjustments?.[0]?.amount || "",
          },
        ],
        status: data.status || "DRAFT",
        paidAmount: data.paidAmount || "",
        forgivenAmount: data.forgivenAmount || "",
        paidAmountINR: data.paidAmountINR || "",
        forgivenReason: data.forgivenReason || "",
        cancellationReason: data.cancellationReason || "",
      });

      setSelectedId(id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setSpin(true);

    fetch(`${process.env.REACT_APP_API_URL}/invoices/?sort=${sortBy}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data Fetcehd from API: ");
        console.log(data);
        setInvoiceData(data.data.invoice);
        setSpin(false);
        // setPeopleData((prevData) => [...data.data.people, ...prevData]);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [submitted, updated, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const isCurrentPageEmpty = currentItems.length === 0 && currentPage > 1;

  const newPage = isCurrentPageEmpty ? currentPage - 1 : currentPage;

  const updatedIndexOfLastItem = newPage * itemsPerPage;
  const updatedIndexOfFirstItem = updatedIndexOfLastItem - itemsPerPage;
  const updatedCurrentItems = invoices.slice(
    updatedIndexOfFirstItem,
    updatedIndexOfLastItem
  );
  // console.log("Data left after filterations: ");
  // console.log(updatedCurrentItems);
  console.log("Test:", projects);

  return (
    <div className="min-h-fit bg-white">
      <div className="relative m-4 overflow-x-auto p-8 shadow-md sm:rounded-lg">
        <div className="flex-column flex flex-wrap items-center justify-between space-y-4 pb-4 sm:flex-row sm:space-y-0">
          <div>
            <button
              id="dropdownRadioButton"
              onClick={handleDropdownToggle}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              type="button"
            >
              {/* Icons and text here */}
              <svg
                className="h-3 w-3 text-gray-500 me-3 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              Recents
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-row justify-between gap-4">
            <div className="relative">
              <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 rtl:right-0">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="w-76 block rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Search for invoices"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              id="dropdownRadioButton"
              onClick={handleDrawerToggle}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              type="button"
            >
              ADD NEW INVOICE
            </button>
            <InvoiceDrawer
              isOpen={isOpen}
              onClose={closeModal}
              handleInputChange={handleInputChange}
              handleDrawerToggle={handleDrawerToggle}
              formData={formData}
              handleSubmit={handleSubmit}
              clients={clients}
              projects={projects}
              managers={managers}
              peoples={people}
              handleServiceChange={handleServiceChange}
              handleAdjustmentChange={handleAdjustmentChange}
              handleClientChange={handleClientChange}
            />
          </div>
        </div>
        {showModal && (
          <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center">
            <div className="absolute top-0 h-full w-full bg-gray-900 opacity-50"></div>
            <div className="z-50 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <DeleteInvoiceConfirm
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
              />
            </div>
          </div>
        )}
        <table className="z-[-1]x w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="items-center p-4">
                S.No.
              </th>
              <th scope="col" className="px-6 py-3">
                Client name
              </th>
              <th scope="col" className="px-6 py-3">
                Project Name
              </th>
              <th scope="col" className="px-6 py-3">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3">
                End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {updatedCurrentItems
              ?.filter((invoice) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();

                return (
                  invoice.clientId?.toLowerCase().includes(query) ||
                  invoice.projectId?.toLowerCase().includes(query) ||
                  invoice.preparedBy?.toLowerCase().includes(query) ||
                  invoice.reviewedBy?.toLowerCase().includes(query)
                );
              })
              ?.map((row, index) => {
                const client = clients.find(
                  (client) => client._id === row.clientId
                );
                const primaryContactPerson = client
                  ? client.primaryContactPerson
                  : "Unknown";

                  const project = projects.find(
                    (project) => project._id === row.projectId
                  );
                  const projectName = project ? project.name : "Unknown";
                return (
                  <tr
                    key={row.id}
                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      {(newPage - 1) * itemsPerPage + index + 1}.
                    </td>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {/* {row.firstname+" "+row.lastname} */}
                      {primaryContactPerson}
                    </th>
                    <td className="px-6 py-4">{projectName}</td>
                    <td className="px-6 py-4">{row.serviceFromDate}</td>
                    <td className="px-6 py-4">{row.serviceToDate}</td>
                    {/* <td className="px-6 py-4">{row.workEmail}</td> */}
                    <td className="px-6 py-4">
                      <div className="flex flex-row items-center gap-3">
                        <a
                          href="#"
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          onClick={(event) => {
                            handleUpdate(event, row._id);
                            handleUpdateDrawerToggle();
                          }}
                        >
                          Edit
                        </a>
                        <MdDelete
                          className="cursor-pointer text-lg text-red-500 hover:text-red-300"
                          onClick={(event) => handleDeleteClick(event, row._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {spin && <Spinner />}

      {/* Pagination */}
      <div className="mr-6 mb-4 flex justify-end">
        <Pagination
          itemsPerPage={itemsPerPage}
          //   totalItems={projectData.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InvoiceTable;
