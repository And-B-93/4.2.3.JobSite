import { Group, Text, Container } from "@mantine/core";

export function Header() {
  return (
    <header
      style={{
        backgroundColor: "#232325",
        height: "60px",
        display: "flex",
        alignItems: "center",
        borderBottom: "none",
      }}
    >
      <Container size="lg" style={{ width: "100%" }}>
        <Group justify="space-between" align="center">
          {/* Логотип */}
          <Text size="xl" fw={700} style={{ color: "white" }}>
            Jobored
          </Text>

          {/* Ссылка "Вакансии FE" */}
          <Text
            style={{
              color: "#5E96FC",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Вакансии FE
          </Text>
        </Group>
      </Container>
    </header>
  );
}
