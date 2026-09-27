import type { Issue } from '../domain';

export function createFixtures(): Issue[] {
  const now = Date.now();
  const at = (hours: number) => new Date(now - hours * 3_600_000).toISOString();
  return [
    {
      id: 'water-sector-15',
      title: 'Water leakage near Sector 15',
      category: 'Water wastage',
      severity: 'High',
      location: 'Sector 15 · Market road',
      description:
        'A water pipe beside the market entrance has been leaking for three days. Water is collecting across the footpath and pedestrians have to step into the road.',
      createdAt: at(3),
      status: 'Reported',
      confirmations: 24,
      history: [{ status: 'Reported', at: at(3), note: 'Shared by a community member.' }],
    },
    {
      id: 'park-dumping',
      title: 'Illegal dumping beside the community park',
      category: 'Waste & dumping',
      severity: 'High',
      location: 'Sector 12 · Community park',
      description:
        'Household rubbish has been dumped beside the eastern park gate. The pile is blocking the entrance and has grown over the past week.',
      createdAt: at(20),
      status: 'Verified',
      confirmations: 18,
      history: [
        { status: 'Reported', at: at(20), note: 'Shared by a community member.' },
        { status: 'Verified', at: at(8), note: 'The location and issue have been checked.' },
      ],
    },
    {
      id: 'broken-footpath',
      title: 'Broken paving on the walk to school',
      category: 'Public infrastructure',
      severity: 'Medium',
      location: 'Sector 8 · School lane',
      description:
        'Several paving slabs are missing outside the school. The uneven surface makes this route difficult for children and wheelchair users.',
      createdAt: at(50),
      status: 'In progress',
      confirmations: 12,
      history: [
        { status: 'Reported', at: at(50), note: 'Shared by a community member.' },
        { status: 'Verified', at: at(40), note: 'The damaged paving has been checked.' },
        { status: 'In progress', at: at(12), note: 'A repair team has accepted the report.' },
      ],
    },
    {
      id: 'bins-cleared',
      title: 'Overflowing recycling bins at the market',
      category: 'Plastic waste',
      severity: 'Medium',
      location: 'Sector 15 · Central market',
      description:
        'The recycling collection point was overflowing onto the footpath. The collection team has now cleared the area and returned the bins to service.',
      createdAt: at(96),
      status: 'Resolved',
      confirmations: 31,
      history: [
        { status: 'Reported', at: at(96), note: 'Shared by a community member.' },
        { status: 'Verified', at: at(80), note: 'Overflow confirmed at the collection point.' },
        { status: 'In progress', at: at(60), note: 'Collection team assigned.' },
        { status: 'Resolved', at: at(24), note: 'Waste collected and the footpath cleared.' },
      ],
    },
    {
      id: 'smoke-industrial',
      title: 'Heavy smoke near the industrial crossing',
      category: 'Air pollution',
      severity: 'High',
      location: 'Sector 6 · Industrial crossing',
      description:
        'Thick smoke is visible near the crossing in the early evening. Please investigate the source and its impact on the nearby residential area.',
      createdAt: at(7),
      status: 'Reported',
      confirmations: 9,
      history: [{ status: 'Reported', at: at(7), note: 'Shared by a community member.' }],
    },
    {
      id: 'saplings-care',
      title: 'New roadside saplings need attention',
      category: 'Trees & greenery',
      severity: 'Low',
      location: 'Sector 10 · Green avenue',
      description:
        'Several recently planted roadside saplings have damaged supports and dry soil. They need watering and their protective supports repaired.',
      createdAt: at(28),
      status: 'Verified',
      confirmations: 7,
      history: [
        { status: 'Reported', at: at(28), note: 'Shared by a community member.' },
        { status: 'Verified', at: at(16), note: 'Saplings checked by a local volunteer.' },
      ],
    },
  ];
}
