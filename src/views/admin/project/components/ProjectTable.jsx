import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useAuthContext } from "hooks/useAuthContext";
import Spinner from "./Spinner";
import DeleteProjectConfirm from "./DeleteProjectConfirm";
import Pagination from "./Pagination";
import ObjectId from "bson-objectid";

const ProjectTable = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const { user } = useAuthContext();

  const [projectData, setProjectData] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [spin, setSpin] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [clients, setClients] = useState([]);
  const [people, setPeople] = useState([]);
  const [acquisitionPeople, setAcquisitionPeople] = useState([]);
  const [managers, setManagers] = useState([]);

  const handleDeleteClick = (event, id) => {
    event.preventDefault();
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    handleDeleteRow(deleteId);
    setShowModal(false);
    setDeleteId(null);
  };

  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    managerId: "",
    acquisitionPersonId: "",
    status: "In Progress",
    startDate: "",
    endDate: "",
    resources: [
      {
        personId: "",
        defaultAllocation: 5,
        startDate: "",
        endDate: "",
        acquisitionPersonId: "",
        billability: "Billable",
        // shadowOf: "",
        billingRate: null,
        billableHours: [],
        overtimeAllocations: [],
      },
    ],
  });

  const handleResourceChange = (index, field, value) => {
    const updatedResources = formData.resources.map((resource, i) => {
      if (i === index) {
        return { ...resource, [field]: value };
      }
      return resource;
    });
    setFormData({ ...formData, resources: updatedResources });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateChange = (event) => {
    const { name, value } = event.target;

    setIdData((prevIdData) => ({
      ...prevIdData,
      [name]: value,
    }));
  };

  const writeDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (event) => {
    setSpin(true);
    event.preventDefault();
    if (
      !formData.name ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.clientId ||
      !formData.managerId ||
      !formData.acquisitionPersonId
    ) {
      alert("Please fill in all required fields.");
      setSpin(false);
      return;
    }
    const formatDate = (date) => {
      return new Date(date).toISOString().split("T")[0];
    };

    const formattedFormData = {
      ...formData,
      clientId: ObjectId(formData.clientId),
      managerId: ObjectId(formData.managerId),
      acquisitionPersonId: ObjectId(formData.acquisitionPersonId),
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      resources: formData.resources.map((resource) => ({
        ...resource,
        personId: ObjectId(resource.personId),
        acquisitionPersonId: ObjectId(resource.acquisitionPersonId),
      })),
    };

    console.log(formattedFormData);

    fetch("https://i-crm-backend-6fqp.onrender.com/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formattedFormData),
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
        setFormData({
          name: "",
          clientId: "",
          managerId: "",
          acquisitionPersonId: "",
          status: "In Progress",
          startDate: "",
          endDate: "",
          resources: [
            {
              personId: "",
              defaultAllocation: 5,
              startDate: "",
              endDate: "",
              acquisitionPersonId: "",
              billability: "Billable",
              billingRate: null,
              billableHours: [],
              overtimeAllocations: [],
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    setSpin(true);

    fetch(`https://i-crm-backend-6fqp.onrender.com/project/?sort=${sortBy}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setProjectData(data.data.projects);
        setSpin(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [deleted, submitted, updated, sortBy]);

  const handleDeleteRow = (id) => {
    setSpin(true);
    fetch(`https://i-crm-backend-6fqp.onrender.com/project/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete row");
        }
        setProjectData((prevData) => prevData.filter((row) => row.id !== id));
        setDeleted((prevDeleted) => !prevDeleted);
        setSpin(false);
      })
      .catch((error) => console.error("Error deleting row:", error));
  };

  const drawerRef = useRef(null);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  //update functions and states

  const [selectedId, setSelectedId] = useState(null);

  const [idData, setIdData] = useState({
    name: "",
    clientId: "",
    managerId: "",
    acquisitionPersonId: "",
    status: "In Progress",
    startDate: "",
    endDate: "",
    resources: [
      {
        personId: "",
        defaultAllocation: 5,
        startDate: "",
        endDate: "",
        acquisitionPersonId: "",
        billability: "Billable",
        // shadowOf: "",
        billingRate: null,
        billableHours: [],
        overtimeAllocations: [],
      },
    ],
  });

  const handleUpdateResourceChange = (index, field, value) => {
    const updatedResources = idData.resources.map((resource, i) => {
      if (i === index) {
        return { ...resource, [field]: value };
      }
      return resource;
    });
    setIdData({ ...idData, resources: updatedResources });
  };

  const handleUpdate = async (event, id) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://i-crm-backend-6fqp.onrender.com/project/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setIdData({
        name: data.name || "",
        clientId: data.clientId || "",
        managerId: data.managerId || "",
        acquisitionPersonId: data.acquisitionPersonId || "",
        status: data.status || "In Progress",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        resources: [
          {
            personId: data.resources[0]?.personId || "",
            defaultAllocation: data.resources[0]?.defaultAllocation || 5,
            startDate: data.resources[0]?.startDate || "",
            endDate: data.resources[0]?.endDate || "",
            acquisitionPersonId: data.resources[0]?.acquisitionPersonId || "",
            billability: data.resources[0]?.billability || "Billable",
            billingRate: data.resources[0]?.billingRate || null,
            billableHours: data.resources[0]?.billableHours || [],
            overtimeAllocations: data.resources[0]?.overtimeAllocations || [],
          },
        ],
      });
      setSelectedId(id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateDrawerToggle = () => {
    setIsUpdateDrawerOpen(!isUpdateDrawerOpen);
  };

  const sendUpdate = (event) => {
    setSpin(true);
    event.preventDefault();
    console.log(idData);

    fetch(`https://i-crm-backend-6fqp.onrender.com/project/${selectedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(idData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setIsUpdateDrawerOpen(false);
        setUpdated((prevUpdated) => !prevUpdated);
        setSpin(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateRef = useRef(null);

  const handleClickOutsideUpdate = (event) => {
    if (updateRef.current && !updateRef.current.contains(event.target)) {
      setIsUpdateDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isUpdateDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutsideUpdate);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUpdate);
    };
  }, [isUpdateDrawerOpen]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projectData.slice(indexOfFirstItem, indexOfLastItem);
  const isCurrentPageEmpty = currentItems.length === 0 && currentPage > 1;

  const newPage = isCurrentPageEmpty ? currentPage - 1 : currentPage;

  const updatedIndexOfLastItem = newPage * itemsPerPage;
  const updatedIndexOfFirstItem = updatedIndexOfLastItem - itemsPerPage;
  const updatedCurrentItems = projectData.slice(
    updatedIndexOfFirstItem,
    updatedIndexOfLastItem
  );

  useEffect(() => {
    fetch("https://i-crm-backend-6fqp.onrender.com/client/")
      .then((response) => response.json())
      .then((data) => {
        setClients(data.data.clients);
      })
      .catch((error) => {
        console.error("Failed to fetch clients", error);
      });
  }, []);

  useEffect(() => {
    fetch("https://i-crm-backend-6fqp.onrender.com/people/")
      .then((response) => response.json())
      .then((data) => {
        setPeople(data.data.people);

        setAcquisitionPeople(
          data.data.people.filter((person) => person.department === "Sales")
        );

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
            {/* {showDropdown && (
              <div
                id="dropdownRadio"
                className="absolute z-10 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
              >
                <ul
                  className="space-y-1 p-3 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownRadioButton"
                >
                  <li>
                    <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-1"
                        type="radio"
                        value=""
                        name="filter-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      />
                      <label
                        for="filter-radio-example-1"
                        className="w-full rounded text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                      >
                        Last day
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        checked=""
                        id="filter-radio-example-2"
                        type="radio"
                        value=""
                        name="filter-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      />
                      <label
                        for="filter-radio-example-2"
                        className="w-full rounded text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                      >
                        Last 7 days
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-3"
                        type="radio"
                        value=""
                        name="filter-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      />
                      <label
                        for="filter-radio-example-3"
                        className="w-full rounded text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                      >
                        Last 30 days
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-4"
                        type="radio"
                        value=""
                        name="filter-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      />
                      <label
                        for="filter-radio-example-4"
                        className="w-full rounded text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                      >
                        Last month
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input
                        id="filter-radio-example-5"
                        type="radio"
                        value=""
                        name="filter-radio"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                      />
                      <label
                        for="filter-radio-example-5"
                        className="w-full rounded text-sm font-medium text-gray-900 ms-2 dark:text-gray-300"
                      >
                        Last year
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            )} */}
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
                placeholder="Search for projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              id="dropdownRadioButton"
              onClick={handleDrawerToggle}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              type="button"
            >
              ADD NEW PROJECT
            </button>
            {/* Drawer starts */}
            {isDrawerOpen && (
              <div
                ref={drawerRef}
                id="drawer-contact"
                className="fixed top-0 right-0 z-40 h-screen w-80 -translate-x-0 overflow-y-auto bg-gray-100 p-4 transition-transform dark:bg-gray-800"
                tabIndex="-1"
              >
                <h5 className="mb-6 inline-flex items-center text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-4 w-4 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                  Add Project
                </h5>
                <button
                  type="button"
                  onClick={handleDrawerToggle}
                  className="bg-transparent absolute top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 end-2.5 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close menu</span>
                </button>
                <form className="mb-6">
                  <div className="mb-6">
                    <label
                      htmlFor="projectName"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Project
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Project Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mx-auto mb-6">
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option selected>Choose a status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                      <option value="Yet to Start">Yet to Start</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="start-date"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Start Date
                    </label>
                    <div className="relative max-w-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="start-date"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span> End Date
                    </label>
                    <div className="relative max-w-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* <div className="mx-auto mb-6">
                    <label
                      htmlFor="clientId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Client ID
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={formData.clientId}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option selected>Choose Client</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                      <option value="Yet to Start">Yet to Start</option>
                    </select>
                  </div> */}

                  <div className="mx-auto mb-6">
                    <label
                      htmlFor="clientId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Select a
                      Client
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      value={formData.clientId}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Choose Client
                      </option>
                      {clients.map((client) => (
                        <option
                          key={client.id}
                          value={client.primaryContactPerson}
                        >
                          {client.primaryContactPerson}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="managerId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Manager
                    </label>
                    <select
                      id="managerId"
                      name="managerId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={formData.managerId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Choose a Manager
                      </option>
                      {managers.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="acquisitionPersonId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Acquisition
                      Person
                    </label>
                    <select
                      id="acquisitionPersonId"
                      name="acquisitionPersonId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={formData.acquisitionPersonId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Choose an Acquisition Person
                      </option>
                      {acquisitionPeople.map((person) => (
                        <option key={person.id} value={person.displayName}>
                          {person.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="mb-6">
                    <label
                      htmlFor="acquisitionPersonId"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Acquisition
                      Person ID
                    </label>
                    <input
                      type="text"
                      id="acquisitionPersonId"
                      name="acquisitionPersonId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Acquisition Person Id"
                      value={formData.acquisitionPersonId}
                      onChange={handleInputChange}
                    />
                  </div> */}
                  <h5 className="mb-6 inline-flex items-center text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
                    <svg
                      className="h-4 w-4 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 16"
                    >
                      <path d="M10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                    Resources
                  </h5>
                  {formData.resources.map((resource, index) => (
                    <div key={index}>
                      {/* <div className="mb-6" key={index}>
                        <label
                          htmlFor="personId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Person
                          Id
                        </label>
                        <input
                          type="text"
                          id="personId"
                          name="personId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Person's Id"
                          value={resource.personId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "personId",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div> */}

                      <div className="mb-6">
                        <label
                          htmlFor="personId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Person
                          Id
                        </label>
                        <select
                          id="personId"
                          name="personId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          value={resource.personId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "personId",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a Person</option>
                          {managers.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mx-auto mb-6">
                        <label
                          htmlFor="defaultAllocation"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Default
                          Allocation
                        </label>
                        <select
                          id="defaultAllocation"
                          name="defaultAllocation"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          value={resource.defaultAllocation}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "defaultAllocation",
                              Number(e.target.value)
                            )
                          }
                          required
                        >
                          <option value="">Choose a Default Allocation</option>
                          {[5, 10, 15, 20, 25, 30, 35, 40].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="resource-start-date"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Start Date
                        </label>
                        <div className="relative max-w-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            id="resource-start-date"
                            name="resource-start-date"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={resource.startDate}
                            onChange={(e) =>
                              handleResourceChange(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="resource-end-date"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          End Date
                        </label>
                        <div className="relative max-w-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            id="resource-end-date"
                            name="resource.end-date"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={resource.endDate}
                            onChange={(e) =>
                              handleResourceChange(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* <div className="mb-6">
                        <label
                          htmlFor="acquisitionPersonId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Acquisition Person Id
                        </label>
                        <input
                          type="text"
                          id="acquisitionPersonId"
                          name="acquisitionPersonId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Acquisition Person's Id"
                          value={resource.acquisitionPersonId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "acquisitionPersonId",
                              e.target.value
                            )
                          }
                        />
                      </div> */}
                      <div className="mb-6">
                        <label
                          htmlFor="acquisitionPersonId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>
                          Acquisition Person Id
                        </label>
                        <select
                          id="acquisitionPersonId"
                          name="acquisitionPersonId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          value={resource.acquisitionPersonId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "acquisitionPersonId",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose an Acquisition Person</option>
                          {acquisitionPeople.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mx-auto mb-6">
                        <label
                          htmlFor="billability"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>
                          Billability
                        </label>
                        <select
                          id="billability"
                          name="billability"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          value={resource.billability}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "billability",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose Billability</option>
                          {["Billable", "Not Billable", "Shadow"].map(
                            (value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* <div className="mb-6">
                        <label
                          htmlFor="shadowOf"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Shadow Of
                        </label>
                        <input
                          type="text"
                          id="shadowOf"
                          name="shadowOf"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Shadow Of"
                          value={resource.shadowOf}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "shadowOf",
                              e.target.value
                            )
                          }
                        />
                      </div> */}

                      <div className="mb-6">
                        <label
                          htmlFor="billingRate"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Billing Rate
                        </label>
                        <input
                          type="number"
                          id="billingRate"
                          name="billingRate"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Billing Rate"
                          value={
                            resource.billingRate === null
                              ? ""
                              : resource.billingRate
                          }
                          onChange={(e) => {
                            const newValue =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            if (
                              newValue === null ||
                              !(
                                resource.billability === "Billable" &&
                                newValue <= 0
                              )
                            ) {
                              handleResourceChange(
                                index,
                                "billingRate",
                                newValue
                              );
                            } else {
                              alert(
                                "Billing rate must be a non-zero positive value if Billability is Billable"
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mb-2 block w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
            {/* Drawer ends */}
            {/* Update Drawer starts */}
            {isUpdateDrawerOpen && (
              <div
                ref={updateRef}
                id="drawer-contact"
                className="fixed top-0 right-0 z-40 h-screen w-80 -translate-x-0 overflow-y-auto bg-gray-100 p-4 transition-transform dark:bg-gray-800"
                tabIndex="-1"
              >
                <h5 className="mb-6 inline-flex items-center text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
                  <svg
                    className="h-4 w-4 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                  Update Person
                </h5>
                <button
                  type="button"
                  onClick={handleUpdateDrawerToggle}
                  className="bg-transparent absolute top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 end-2.5 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close menu</span>
                </button>
                <form className="mb-6">
                  <div className="mb-6">
                    <label
                      htmlFor="projectName"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Project
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Project Name"
                      value={idData.name}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="mx-auto mb-6">
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={idData.status}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option selected>Choose a status</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Completed">Completed</option>
                      <option value="Yet to Start">Yet to Start</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="start-date"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Start Date
                    </label>
                    <div className="relative max-w-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value={idData.startDate}
                        onChange={handleUpdateChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="start-date"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span> End Date
                    </label>
                    <div className="relative max-w-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-4 w-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        value={idData.endDate}
                        onChange={handleUpdateChange}
                      />
                    </div>
                  </div>

                  <div className="mx-auto mb-6">
                    <label
                      htmlFor="clientId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Select a
                      Client
                    </label>
                    <select
                      id="clientId"
                      name="clientId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                      value={idData.clientId}
                      onChange={handleUpdateChange}
                    >
                      <option value="" disabled>
                        Choose Client
                      </option>
                      {clients.map((client) => (
                        <option
                          key={client.id}
                          value={client.primaryContactPerson}
                        >
                          {client.primaryContactPerson}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="mb-6">
                    <label
                      htmlFor="clientId"
                      className="mb-2 block text-sm font-medium text-gray-900 "
                    >
                      <span className="text-lg text-red-500">*</span>Client ID
                    </label>
                    <input
                      type="text"
                      id="clientId"
                      name="clientId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Client Id"
                      value={idData.clientId}
                      onChange={handleUpdateChange}
                    />
                  </div> */}

                  <div className="mb-6">
                    <label
                      htmlFor="managerId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Manager
                    </label>
                    <select
                      id="managerId"
                      name="managerId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={idData.managerId}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="" disabled>
                        Choose a Manager
                      </option>
                      {managers.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="acquisitionPersonId"
                      className="mb-2 block text-sm font-medium text-gray-900"
                    >
                      <span className="text-lg text-red-500">*</span>Acquisition
                      Person
                    </label>
                    <select
                      id="acquisitionPersonId"
                      name="acquisitionPersonId"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      value={idData.acquisitionPersonId}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="" disabled>
                        Choose an Acquisition Person
                      </option>
                      {acquisitionPeople.map((person) => (
                        <option key={person.id} value={person.displayName}>
                          {person.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h5 className="mb-6 inline-flex items-center text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
                    <svg
                      className="h-4 w-4 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 16"
                    >
                      <path d="M10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                    Resources
                  </h5>
                  {idData.resources.map((resource, index) => (
                    <div key={index}>
                      <div className="mb-6">
                        <label
                          htmlFor="personId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Person
                          Id
                        </label>
                        <select
                          id="personId"
                          name="personId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          value={resource.personId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "personId",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose a Person</option>
                          {managers.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mx-auto mb-6">
                        <label
                          htmlFor="defaultAllocation"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>Default
                          Allocation
                        </label>
                        <select
                          id="defaultAllocation"
                          name="defaultAllocation"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          value={resource.defaultAllocation}
                          onChange={(e) =>
                            handleUpdateResourceChange(
                              index,
                              "defaultAllocation",
                              Number(e.target.value)
                            )
                          }
                          required
                        >
                          <option value="">Choose a Default Allocation</option>
                          {[5, 10, 15, 20, 25, 30, 35, 40].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="resource-start-date"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Start Date
                        </label>
                        <div className="relative max-w-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            id="resource-start-date"
                            name="resource-start-date"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={resource.startDate}
                            onChange={(e) =>
                              handleUpdateResourceChange(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="resource-end-date"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          End Date
                        </label>
                        <div className="relative max-w-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              className="h-4 w-4 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            id="resource-end-date"
                            name="resource.end-date"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            value={resource.endDate}
                            onChange={(e) =>
                              handleUpdateResourceChange(
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="acquisitionPersonId"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>
                          Acquisition Person Id
                        </label>
                        <select
                          id="acquisitionPersonId"
                          name="acquisitionPersonId"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          value={resource.acquisitionPersonId}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "acquisitionPersonId",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose an Acquisition Person</option>
                          {acquisitionPeople.map((person) => (
                            <option key={person.id} value={person.id}>
                              {person.displayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mx-auto mb-6">
                        <label
                          htmlFor="billability"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          <span className="text-lg text-red-500">*</span>
                          Billability
                        </label>
                        <select
                          id="billability"
                          name="billability"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          value={resource.billability}
                          onChange={(e) =>
                            handleUpdateResourceChange(
                              index,
                              "billability",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="">Choose Billability</option>
                          {["Billable", "Not Billable", "Shadow"].map(
                            (value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* <div className="mb-6">
                        <label
                          htmlFor="shadowOf"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Shadow Of
                        </label>
                        <input
                          type="text"
                          id="shadowOf"
                          name="shadowOf"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Shadow Of"
                          value={resource.shadowOf}
                          onChange={(e) =>
                            handleResourceChange(
                              index,
                              "shadowOf",
                              e.target.value
                            )
                          }
                        />
                      </div> */}

                      <div className="mb-6">
                        <label
                          htmlFor="billingRate"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Billing Rate
                        </label>
                        <input
                          type="number"
                          id="billingRate"
                          name="billingRate"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                          placeholder="Billing Rate"
                          value={
                            resource.billingRate === null
                              ? ""
                              : resource.billingRate
                          }
                          onChange={(e) => {
                            const newValue =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value);
                            if (
                              newValue === null ||
                              !(
                                resource.billability === "Billable" &&
                                newValue <= 0
                              )
                            ) {
                              handleUpdateResourceChange(
                                index,
                                "billingRate",
                                newValue
                              );
                            } else {
                              alert(
                                "Billing rate must be a non-zero positive value if Billability is Billable"
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    onClick={(event) => sendUpdate(event)}
                    className="mb-2 block w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Update
                  </button>
                </form>
              </div>
            )}
            {/* Update Drawer ends */}
          </div>
          {/* Add New Person */}
        </div>
        {showModal && (
          <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center">
            <div className="absolute top-0 h-full w-full bg-gray-900 opacity-50"></div>
            <div className="z-50 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
              <DeleteProjectConfirm
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
                {/* <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                  />
                  <label for="checkbox-all-search" 
                  className="sr-only">
                    checkbox
                  </label>
                </div> */}
                S.No.
              </th>
              <th scope="col" className="px-6 py-3">
                Project name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3">
                End Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {updatedCurrentItems
              ?.filter((person) => {
                if (!searchQuery.trim()) return true;

                const query = searchQuery.toLowerCase();

                return (
                  person.displayName?.toLowerCase().includes(query) ||
                  person.department?.toLowerCase().includes(query) ||
                  person.mobile?.toLowerCase().includes(query) ||
                  person.workEmail?.toLowerCase().includes(query)
                );
              })
              ?.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    {/* <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                    /> */}
                    {(newPage - 1) * itemsPerPage + index + 1}.
                  </td>
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {/* {row.firstname+" "+row.lastname} */}
                    {row.name}
                  </th>
                  <td className="px-6 py-4">{row.status}</td>
                  <td className="px-6 py-4">{writeDate(row.startDate)}</td>
                  <td className="px-6 py-4">{writeDate(row.endDate)}</td>
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
              ))}
          </tbody>
        </table>
      </div>

      {spin && <Spinner />}

      {/* Pagination */}
      <div className="mr-6 mb-4 flex justify-end">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={projectData.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProjectTable;
