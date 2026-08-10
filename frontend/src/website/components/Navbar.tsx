import {
  Button,
  Drawer,
  Group,
  Image,
  Input,
  Modal,
  Select,
  Stack,
  Text,
  Burger,
} from "@mantine/core";
import { useDisclosure, useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useState } from "react";
import { axiosPrivateInstance } from "../../api";
import { PostLead } from "../../api/website";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const Navbar = () => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const queryClient = useQueryClient();
  const [scroll] = useWindowScroll();

  const isScrolled = scroll.y > 20;

  const handleSubmit = async () => {
    const body = {
      name,
      email,
      contact,
      businessType,
      businessName,
    };
    const response = await axiosPrivateInstance.post(PostLead, body);
    return response.data;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      closeModal();
      toast.success("Submitted successfully");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
        refetchType: "active",
        exact: true,
      });
    },

    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || err.message || "An error occurred"
      );
    },
  });

  gsap.registerPlugin(ScrollToPlugin);

  const scrollToSection = (id) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: `#${id}`, offsetY: 70 },
      ease: "power2.out",
    });
  };

  const navItems = (
    <>
      <a
        className={linkClassName}
        onClick={() => scrollToSection("features")}
      >
        Features
      </a>
      <a className={linkClassName} onClick={() => scrollToSection("how-it-works")}>
        How It Works
      </a>
      <a className={linkClassName} href="#contact">
        Contact Us
      </a>
    </>
  );

  const actionButtons = (
    <>
      <button
        onClick={() => {
          navigate("/login");
          closeDrawer();
        }}
        className="px-5 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-[#EC5B00] hover:bg-orange-50/60 transition-all duration-200 cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => {
          openModal();
          closeDrawer();
        }}
        className="bg-gradient-to-r from-[#EC5B00] to-[#FF7A29] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-[0_4px_18px_rgba(236,91,0,0.35)] hover:shadow-[0_6px_25px_rgba(236,91,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Signup for Free</span>
        <FaArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </>
  );

  return (
    <>
      <Modal
        radius={20}
        opened={modalOpened}
        onClose={closeModal}
        size="lg"
        title={
          <Text fw={600} fz="lg">
            Get access to Scan Menu
          </Text>
        }
      >
        <Text size="sm" mb="md" c="dimmed">
          Provide us with your contact details and we'll get back to you.
        </Text>
        <Group grow wrap="nowrap" align="start">
          <Stack w="100%" gap="sm">
            <Text size="sm" c="#4E4B66">
              Name
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
            />
            <Text size="sm" c="#4E4B66">
              Contact
            </Text>
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
            />
            <Text size="sm" c="#4E4B66">
              Business Name
            </Text>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
          </Stack>
          <Stack w="100%" gap="sm">
            <Text size="sm" c="#4E4B66">
              Email
            </Text>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            <Text size="sm" c="#4E4B66">
              Business Type
            </Text>
            <Select
              value={businessType}
              onChange={(e) => setBusinessType(e || "")}
              placeholder="Select type"
              data={["Restaurant", "Hotel", "Cafe", "Bar"]}
            />
          </Stack>
        </Group>
        <Group justify="center" mt="xl">
          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            bg="#EC5B00"
            color="white"
            onClick={() => mutate()}
            loading={isPending}
          >
            Submit
          </Button>
        </Group>
      </Modal>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        padding="xl"
        size="80%"
        withCloseButton
      >
        <Stack gap="xl" align="center" mt="md">
          <Image src="img/scanlogo.png" w={90} mb="sm" />
          <Stack gap="lg" align="center" w="100%">
            {navItems}
          </Stack>
          <Stack gap="md" w="100%" mt="md">
            {actionButtons}
          </Stack>
        </Stack>
      </Drawer>

      {/* Floating Pill Navbar */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between rounded-full transition-all duration-300 backdrop-blur-2xl ring-1 ${
          isMobile ? "px-5 h-[58px] w-[92%]" : "px-7 h-[64px] w-[88%] max-w-5xl"
        } ${
          isScrolled
            ? "top-3 bg-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white/80 ring-black/5"
            : "top-5 md:top-6 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/60 ring-black/5"
        }`}
      >
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center transition-transform hover:scale-105"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Image src="img/scanlogo.png" w={86} />
        </div>

        {isMobile ? (
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size="sm"
            color="#EC5B00"
          />
        ) : (
          <>
            {/* Center Nav Links */}
            <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/40">
              {navItems}
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2">
              {actionButtons}
            </div>
          </>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-24 md:h-28" />
    </>
  );
};

const linkClassName =
  "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-slate-600 hover:text-[#EC5B00] hover:bg-white transition-all duration-200 cursor-pointer select-none shadow-xs hover:shadow-xs";

export default Navbar;

