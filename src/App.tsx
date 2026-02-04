import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextInput,
  Select,
  Pill,
  Group,
  Button,
  Pagination,
  Container,
  Title,
  Stack,
  Flex,
  Text,
  Badge,
} from "@mantine/core";
import "./App.css";
import type { RootState } from "./store/store";
import {
  fetchVacancies,
  setSearch,
  setArea,
  addSkill,
  removeSkill,
  setPage,
} from "./reducers/fetchSlice";
import type { AppDispatch } from "./store/store";
import { Header } from "./components/Header";
import { IconMapPin, IconPlus, IconSearch } from "@tabler/icons-react";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { vacancies, loading, error, totalPages, page, search, area, skills } =
    useSelector((state: RootState) => state.fetch);

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch, page, area, skills]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleSearchClick = () => {
    dispatch(fetchVacancies());
  };

  const handleAreaChange = (value: string | null) => {
    dispatch(setArea(value || ""));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      dispatch(addSkill(newSkill.trim()));
      setNewSkill("");
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage - 1));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddSkill();
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Ошибка: {error}
      </div>
    );

  const iconMap = <IconMapPin />;
  const iconSearch = <IconSearch />;
  const iconPlus = <IconPlus />;
  return (
    <>
      <Header />

      <Container>
        <div className="titleSearch">
          <div className="title">
            <h2>Список вакансий</h2>
            <h3>по профессии Frontend-разработчик</h3>
          </div>
          <div className="search">
            <TextInput
              placeholder="Должность или название компании"
              value={search}
              onChange={handleSearchChange}
              leftSection={iconSearch}
              style={{ width: "100%", marginRight: "24px" }}
            />
            <div>
              <Button onClick={handleSearchClick}>Найти</Button>
            </div>
          </div>
        </div>

        <Flex>
          <Stack
            w={400}
            style={{
              minWidth: "320px",
              margin: "0 12px",
            }}
          >
            <Group
              style={{
                padding: "24px",
                backgroundColor: "white",
                borderRadius: "12px",
              }}
            >
              <Text size="m" fw={700}>
                Ключевые навыки
              </Text>

              <Group style={{}}>
                <TextInput
                  size="sm"
                  placeholder="Навык"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button size="xs" onClick={handleAddSkill}>
                  {iconPlus}
                </Button>
              </Group>

              {skills.map((skill) => (
                <Pill
                  size="md"
                  key={skill}
                  withRemoveButton
                  onRemove={() => dispatch(removeSkill(skill))}
                >
                  {skill}
                </Pill>
              ))}
            </Group>

            <Select
              data={[
                { value: "", label: "Все города" },
                { value: "1", label: "Москва" },
                { value: "2", label: "Санкт-Петербург" },
              ]}
              value={area}
              onChange={handleAreaChange}
              leftSection={iconMap}
              style={{
                padding: "24px",
                backgroundColor: "white",
                borderRadius: "12px",
              }}
            />
          </Stack>

          <Stack w={660} style={{ alignItems: "center" }}>
            {vacancies.map((vacancy) => (
              <Stack
                gap="xs"
                key={vacancy.id}
                style={{
                  border: "1px solid #dee2e6",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  minHeight: "250px !important",
                  width: "500px ",
                  padding: "24px",
                }}
              >
                <Title order={5}>{vacancy.name}</Title>

                <Group>
                  <Text>
                    {vacancy.salary ? (
                      <>
                        {vacancy.salary.from} - {vacancy.salary.to}{" "}
                        {vacancy.salary.currency}
                      </>
                    ) : (
                      "з/п не указана"
                    )}
                  </Text>
                  <Text>Опыт: {vacancy.experience.name}</Text>
                </Group>

                <Text size="xs" style={{ color: "lightgray" }}>
                  {vacancy.employer.name}
                </Text>

                <Text size="xs">
                  {vacancy.work_format.map((format) => {
                    if (format.id === "REMOTE")
                      return (
                        <Badge
                          size="xs"
                          radius="xs"
                          style={{ marginLeft: "2px", marginRight: "2px" }}
                        >
                          {format.name}
                        </Badge>
                      );
                    if (format.id === "HYBRID")
                      return (
                        <Badge
                          color="black"
                          size="xs"
                          radius="xs"
                          style={{ marginLeft: "2px", marginRight: "2px" }}
                        >
                          {format.name}
                        </Badge>
                      );
                    if (format.id === "ON_SITE")
                      return (
                        <Badge
                          color="gray"
                          size="xs"
                          radius="xs"
                          style={{ marginLeft: "2px", marginRight: "2px" }}
                        >
                          {format.name}
                        </Badge>
                      );
                  })}
                </Text>

                <Text h={20}>{vacancy.area.name}</Text>

                <Group gap="xs">
                  <Button color="black" size="xs" variant="filled">
                    Смотреть вакансию
                  </Button>

                  <a type="button" href="https://hh.ru/">
                    <Button
                      variant="filled"
                      size="xs"
                      styles={{
                        root: {
                          backgroundColor: "lightgrey",
                        },
                      }}
                    >
                      <span style={{ color: "black" }}>Откликнуться</span>
                    </Button>
                  </a>
                </Group>
              </Stack>
            ))}
            {totalPages > 0 && (
              <Pagination.Root
                total={totalPages}
                onChange={handlePageChange}
                value={page + 1}
                style={{ margin: "24px" }}
              >
                <Group gap={5} justify="center">
                  <Pagination.First />
                  <Pagination.Previous />
                  <Pagination.Items />
                  <Pagination.Next />
                  <Pagination.Last />
                </Group>
              </Pagination.Root>
            )}
          </Stack>
        </Flex>
      </Container>
    </>
  );
}

export default App;
