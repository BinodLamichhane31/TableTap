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
      <a style={linkStyle} onClick={() => scrollToSection("features")}>
        Features
      </a>
      <a style={linkStyle} href="#contact">
        Contact Us
      </a>
      <a style={linkStyle} onClick={() => scrollToSection("how-it-works")}>
        How It Works
      </a>
    </>
  );

  const actionButtons = (
    <>
      <Button
        c="#EC5B00"
        variant="subtle"
        radius="xl"
        onClick={() => {
          navigate("/login");
          closeDrawer();
        }}
        style={{ fontWeight: 500, letterSpacing: "0.3px" }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          openModal();
          closeDrawer();
        }}
        radius="xl"
        w={isMobile ? "100%" : "auto"}
        px={isMobile ? undefined : 24}
        h={44}
        bg="#EC5B00"
        rightSection={<FaArrowRight size={14} />}
        style={{
          fontWeight: 500,
          letterSpacing: "0.3px",
          boxShadow: "0 4px 15px rgba(236, 91, 0, 0.35)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 20px rgba(236, 91, 0, 0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 15px rgba(236, 91, 0, 0.35)";
        }}
      >
        Signup for Free
      </Button>
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

      {/* Sticky Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isMobile ? "12px 20px" : "0 60px",
          height: isMobile ? "auto" : "70px",
          display: "flex",
          alignItems: "center",
          transition: "all 0.3s ease",
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.92)"
            : "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: isScrolled
            ? "0 2px 20px rgba(0, 0, 0, 0.09)"
            : "0 1px 0 rgba(0,0,0,0.06)",
          borderBottom: isScrolled
            ? "1px solid rgba(236, 91, 0, 0.1)"
            : "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <Group justify="space-between" align="center" w="100%">
          {/* Logo */}
          <div
            style={{ cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image src="img/scanlogo.png" w={90} />
          </div>

          {isMobile ? (
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              size="sm"
              color="#EC5B00"
            />
          ) : (
            <Group gap={36} align="center">
              {navItems}
              <Group gap={8}>{actionButtons}</Group>
            </Group>
          )}
        </Group>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div style={{ height: isMobile ? "64px" : "70px" }} />
    </>
  );
};

const linkStyle: React.CSSProperties = {
  fontWeight: 500,
  lineHeight: "24px",
  letterSpacing: "0.4px",
  fontFamily: "Poppins, sans-serif",
  color: "#3D3A50",
  fontSize: "15px",
  textDecoration: "none",
  cursor: "pointer",
  position: "relative",
  padding: "4px 0",
  transition: "color 0.2s ease",
};

export default Navbar;
