import { Calendar } from "../@/components/ui/calendar"
export default function Home({ data }) {
  return (
    <div>
          <Calendar
      mode="single"
      className="rounded-md border"
    />
    </div>
  );
}
  
export function getServerSideProps() {
  return {
    props: { data: "world" },
  }
}
