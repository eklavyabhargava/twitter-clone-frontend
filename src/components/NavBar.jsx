import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import AppIcon from "../shared/AppIcon";
import { useSelector } from "react-redux";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useApiUrl } from "../App";
import Modal from "react-bootstrap/Modal";
import SearchModal from "../pages/SearchModal";
import axios from "axios";
import Loading from "./loading";

export default function NavBar({ onApiError, token }) {
  const API_URL = useApiUrl();
  const user = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showSearchModal, setSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [readyToFetch, setFetchState] = useState(false);

  const handleShow = () => {
    setSearchModal((curr) => !curr);
  };

  const navigation = {
    pages: [
      { name: "Home", href: "/" },
      { name: "Profile", href: `/profile?userId=${user._id}` },
    ],
  };

  const fetchUsers = async () => {
    if (!searchTerm) {
      setSearchResults([]);
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/user/get-user-by-name/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        setSearchResults(response.data.users);
      } else if (response.status === 404 || !response.data.isSuccess) {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.response.status === 404 || !error.response.data.isSuccess) {
        setSearchResults([]);
      } else {
        onApiError(error);
      }
    }
    setIsSearching(false);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  let timer,
    timeoutVal = 800; // time it takes to wait for user to stop typing in ms

  const typer = document.getElementById("search-input");

  typer && typer.addEventListener("keyup", handleKeyUp);

  // when the user has stopped pressing on keys, set the timeout
  // if the user presses on keys before the timeout is reached, then this timeout is canceled
  function handleKeyUp(e) {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
      setFetchState(true);
    }, timeoutVal);
  }

  useEffect(() => {
    if (readyToFetch) {
      fetchUsers();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToFetch]);

  useEffect(() => {
    if (readyToFetch) {
      setFetchState(false);
    }

    // eslint-disable-next-line
  }, [searchTerm]);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        to={page.href}
                        onClick={() => setOpen(false)}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <Link
                      onClick={logout}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Twitter Clone</span>
                  <AppIcon width={30} height={30} />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </Link>
                  ))}
                  <Link
                    onClick={logout}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Logout
                  </Link>
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {/* Search */}
                <div
                  className="flex lg:ml-6 cursor-pointer"
                  onClick={() => handleShow()}
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Logged-in User */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link
                    to={`/profile?userId=${user._id}`}
                    className="group -m-2 flex items-center p-2"
                  >
                    <img
                      className="h-8 w-8 rounded-2xl"
                      id="profilePic"
                      src={`${API_URL}/profile/${user?.profilePic}`}
                      alt=""
                    />
                    <span className="ml-2 text-sm font-normal text-gray-700 group-hover:text-gray-800">
                      {user.name}
                    </span>
                    <span className="sr-only">{}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Modal
        show={showSearchModal}
        fullscreen
        onHide={() => setSearchModal(false)}
        contentClassName="max-w-xl mx-auto"
      >
        <Modal.Header>
          <Modal.Title>
            <input
              type="text"
              name="search"
              id="search-input"
              value={searchTerm}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="username"
              onChange={handleSearchInput}
              autoFocus
            />
          </Modal.Title>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSearchModal(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </Modal.Header>
        {searching && <Loading />}
        <SearchModal
          users={searchResults}
          searchTerm={searchTerm}
          onClose={() => {
            setSearchModal(false);
            setSearchTerm("");
            setSearchResults([]);
          }}
        />
      </Modal>
    </div>
  );
}
