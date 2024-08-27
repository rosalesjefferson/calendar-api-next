import CreateEventForm from "../components/CreateEventForm";

export default function AppointmentPage() {
  console.log('APPOINTMENT PAGE')
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointment Scheduling</h1>
      <CreateEventForm />
    </div>
  );
}
