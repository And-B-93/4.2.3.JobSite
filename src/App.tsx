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

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { vacancies, loading, error, totalPages, page, search, area, skills } =
    useSelector((state: RootState) => state.fetch);

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    dispatch(fetchVacancies());
  }, [dispatch, page, search, area, skills]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <>
      <Header />
      <Container size="lg" py="xl">
        <Title order={1} mb="xl">
          Список вакансий по профессии Frontend-разработчик
        </Title>

        {/* Фильтры */}
        <Stack gap="md" mb="xl">
          <TextInput
            placeholder="Поиск по названию вакансии или компании"
            value={search}
            onChange={handleSearchChange}
          />

          <Select
            placeholder="Выберите город"
            data={[
              { value: "", label: "Все города" },
              { value: "1", label: "Москва" },
              { value: "2", label: "Санкт-Петербург" },
            ]}
            value={area}
            onChange={handleAreaChange}
          />

          <div>
            <Group gap="xs" mb="xs">
              {skills.map((skill) => (
                <Pill
                  key={skill}
                  withRemoveButton
                  onRemove={() => dispatch(removeSkill(skill))}
                >
                  {skill}
                </Pill>
              ))}
            </Group>
            <Group>
              <TextInput
                placeholder="Добавить навык"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                // onKeyPress={handleKeyPress}
              />
              <Button onClick={handleAddSkill}>+</Button>
            </Group>
          </div>
        </Stack>

        {/* Список вакансий */}
        <Stack gap="md" mb="xl">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy.id}
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "white",
              }}
            >
              <Title order={3} mb="xs">
                {vacancy.name}
              </Title>

              <Group gap="xl" mb="xs">
                <span>
                  <strong>Компания:</strong> {vacancy.employer.name}
                </span>
                <span>
                  <strong>Город:</strong> {vacancy.area.name}
                </span>
                <span>
                  <strong>Опыт:</strong> {vacancy.experience.name}
                </span>
              </Group>

              {vacancy.salary && (
                <p>
                  <strong>Зарплата:</strong> {vacancy.salary.from || ""} -{" "}
                  {vacancy.salary.to || ""} {vacancy.salary.currency}
                </p>
              )}

              <Group gap="md" mt="md">
                <Button variant="outline">Смотреть вакансию</Button>
                <Button
                  component="a"
                  target="_blank"
                  variant="filled"
                  color="blue"
                >
                  Откликнуться
                </Button>
              </Group>
            </div>
          ))}
        </Stack>

        {/* Пагинация */}
        {totalPages > 0 && (
          <Pagination
            total={totalPages}
            value={page + 1}
            onChange={handlePageChange}
          />
        )}
      </Container>
    </>
  );
}

export default App;
