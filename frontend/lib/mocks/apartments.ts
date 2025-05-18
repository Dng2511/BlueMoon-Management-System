import { ApartmentsResponse } from "../types/apartment";

export const mockApartmentsData: ApartmentsResponse = {
  content: [
    {
      id: 1,
      name: "Nha me Long",
      residents: [],
    },
    {
      id: 2,
      name: "Nha me Long",
      residents: [
        {
          id: 4,
          fullName: "Nguyễn Văn A",
          relation: "OWNER",
        },
        {
          id: 5,
          fullName: "Nguyễn Văn A",
          relation: "OWNER",
        },
      ],
    },
    {
      id: 3,
      name: "Nha chu nig",
      residents: [],
    },
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalPages: 1,
  totalElements: 3,
  size: 10,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 3,
  empty: false,
};
