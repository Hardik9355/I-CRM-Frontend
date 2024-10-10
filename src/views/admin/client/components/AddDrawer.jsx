import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddDrawer = ({
  isDrawerOpen,
  handleDrawerToggle,
  formData,
  handleInputChange,
  handleSubmit,
  drawerRef,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
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
            Add Client
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
                htmlFor="primaryContactPerson"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Contact Person
              </label>
              <input
                type="text"
                id="primaryContactPerson"
                name="primaryContactPerson"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Contact Person's name"
                value={formData.primaryContactPerson}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="billingContactPerson"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Billing Name
              </label>
              <input
                type="text"
                id="billingContactPerson"
                name="billingContactPerson"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Billing Person's name"
                value={formData.billingContactPerson}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="customerDisplayName"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Display  Name
              </label>
              <input
                type="text"
                id="customerDisplayName"
                name="customerDisplayName"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Display"
                value={formData.customerDisplayName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="businessName"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Company
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="primaryContactNumber"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Phone
              </label>
              <input
                type="phone"
                id="primaryContactNumber"
                name="primaryContactNumber"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Primary phone number"
                value={formData.primaryContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}
            {/* <div className="mb-6">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <span className="text-lg text-red-500">*</span>Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-600 dark:text-gray-300"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </div> */}

            <div className="mb-6">
              <label
                htmlFor="secondaryContactNumber"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Secondary Phone
              </label>
              <input
                type="phone"
                id="secondaryContactNumber"
                name="secondaryContactNumber"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Secondary phone number"
                value={formData.secondaryContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mx-auto mb-6">
              <label
                htmlFor="GSTTreatment"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>GST Treatment
              </label>
              <select
                id="GSTTreatment"
                name="GSTTreatment"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={formData.GSTTreatment}
                onChange={handleInputChange}
                required
              >
                <option selected>Choose a GST Treatment</option>
                <option value="Registered">Registered</option>
                <option value="Registered – Composition">
                  Registered – Composition
                </option>
                <option value="Unregistered">Unregistered</option>
                <option value="Consumer">Consumer</option>
                <option value="Overseas">Overseas</option>
                <option value="SEZ">SEZ</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="placeOfSupply"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Place Of Supply
              </label>
              <input
                type="text"
                id="placeOfSupply"
                name="placeOfSupply"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Place Of Supply"
                value={formData.placeOfSupply}
                onChange={handleInputChange}
              />
            </div>

            {/* <div className="mb-6">
                    <label
                      htmlFor="department"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      placeholder="Engineering, Sales or Outside Inzint..."
                    />
                  </div> */}

            <div className="mx-auto mb-6">
              <label
                htmlFor="taxPreference"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Tax Preference
              </label>
              <select
                id="taxPreference"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={formData.taxPreference}
                onChange={handleInputChange}
                name="taxPreference"
              >
                <option selected>Choose tax preference</option>
                <option value="Taxable">Taxable</option>
                <option value="Tax Exempt">Tax Exempt</option>
              </select>
            </div>

            <div className="mx-auto mb-6">
              <label
                htmlFor="currency"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Currency
              </label>
              <select
                id="currency"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={formData.currency}
                onChange={handleInputChange}
                name="currency"
              >
                <option selected>Choose a currency</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="openingBalance"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Opening Balance
              </label>
              <input
                type="number"
                id="openingBalance"
                name="openingBalance"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Opening Balance"
                value={formData.openingBalance}
                onChange={handleInputChange}
              />
            </div>

            <div className="mx-auto mb-6">
              <label
                htmlFor="enablePortal"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                <span className="text-lg text-red-500">*</span>Enable Portal
              </label>
              <select
                id="enablePortal"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                value={formData.enablePortal}
                onChange={handleInputChange}
                name="enablePortal"
              >
                <option selected>Choose an action</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>

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
    </div>
  );
};

export default AddDrawer;
