import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '~/components/dashboard/dashboard-layout'

export const Route = createFileRoute('/dashboard/spots')({
  component: SpotsPage,
})

function SpotsPage() {
  const spots = [
    { id: 'A-01', zone: 'Zone A', status: 'Available', type: 'Standard' },
    { id: 'A-02', zone: 'Zone A', status: 'Occupied', type: 'EV' },
    { id: 'B-04', zone: 'Zone B', status: 'Reserved', type: 'Standard' },
  ]

  return (
    <DashboardLayout title="Parking Spots">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {spots.map((spot) => (
              <tr key={spot.id}>
                <td className="px-6 py-4 font-medium text-gray-900">{spot.id}</td>
                <td className="px-6 py-4 text-gray-600">{spot.zone}</td>
                <td className="px-6 py-4 text-gray-600">{spot.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      spot.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : spot.status === 'Reserved'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {spot.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
