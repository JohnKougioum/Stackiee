export interface ApiResult<T> {
  statusCode: number
  body: T
}

export interface PostData {
  id: string
  body: string
  createdAt: string
  updatedAt: string
  semester: number
  course: string
  userId: string
  User: User
  _count: {
    Comment: number
  }
}

export interface CommentData {
  id: string
  body: string
  createdAt: string
  updatedAt: string
  userId: string
  User: User
  postId: string
}

export interface User {
  id: string
  uid: string
  am: string
  fullName: string
  fullNameEL: string
  email: string
  eduPersonAffiliation: string
  eduPersonPrimaryAffiliation: string
  regyear: string
}
export interface IhuApiProfile {
  uid: string
  am: string
  regyear: string
  regsem: string
  'givenName;lang-el': string
  'sn;lang-el': string
  'fathersname;lang-el': string
  eduPersonAffiliation: string
  eduPersonPrimaryAffiliation: string
  title: string
  'title;lang-el': string
  'cn;lang-el': string
  cn: string
  sn: string
  givenName: string
  fathersname: string
  secondarymail: string
  telephoneNumber: string
  labeledURI: string
  id: string
  mail: string
  pwdChangedTime: string
  sem: string
  socialMedia: {
    socialMediaExtra: any[]
  }
  profilePhoto: string
}

interface ClassItem {
  courses: {
    [key: number]: {
      nameEL: string
      nameEN: string
    }
  }
}

interface Classes {
  [key: number]: ClassItem
}

export const classes: Classes = {
  1: {
    courses: {
      1101: {
        nameEL: 'Μαθηματικά Ι',
        nameEN: 'Mathematics Ι',
      },
      1102: {
        nameEL: 'Δομημένος Προγραμματισμός',
        nameEN: 'Structured Programming',
      },
      1103: {
        nameEL: 'Εισαγωγή στην Επιστήμη των Υπολογιστών',
        nameEN: 'Introduction to computer science',
      },
      1104: {
        nameEL: 'Ηλεκτρονική Φυσική',
        nameEN: 'Electronic Physics',
      },
      1105: {
        nameEL: 'Κυκλώματα Συνεχούς Ρεύματος',
        nameEN: 'DC Circuits',
      },
    },
  },
  2: {
    courses: {
      1201: {
        nameEL: 'Μαθηματικά ΙΙ',
        nameEN: 'Mathematics II',
      },
      1202: {
        nameEL: 'Μετρήσεις και Κυκλώματα Εναλλασσόμενου Ρεύματος',
        nameEN: 'Measurements and Alternating Current Circuits',
      },
      1203: {
        nameEL: 'Τεχνική Συγγραφή, Παρουσίαση και Ορολογία Ξένης Γλώσσας',
        nameEN: 'Technical Writing, Presentation and Terminology of Foreign Language',
      },
      1204: {
        nameEL: 'Σχεδίαση Ψηφιακών Συστημάτων',
        nameEN: 'Digital System Design',
      },
      1205: {
        nameEL: 'Αντικειμενοστρεφής Προγραμματισμός',
        nameEN: 'Object Oriented Programming',
      },
    },
  },
  3: {
    courses: {
      1301: {
        nameEL: 'Θεωρία Πιθανοτήτων και Στατιστική',
        nameEN: 'Probability Theory and Statistics',
      },
      1302: {
        nameEL: 'Μαθηματικά ΙΙI',
        nameEN: 'Mathematics ΙΙI',
      },
      1303: {
        nameEL: 'Επεξεργασία Σήματος',
        nameEN: 'Signal Processing',
      },
      1305: {
        nameEL: 'Δομές Δεδομένων και Ανάλυση Αλγορίθμων',
        nameEN: 'Data Structures and Analysis of Algorithms',
      },
      1405: {
        nameEL: 'Γλώσσες και Τεχνολογίες Ιστού',
        nameEN: 'Web Languages and Technologies',
      },
    },
  },
  4: {
    courses: {
      1401: {
        nameEL: 'Συστήματα Διαχείρισης Βάσεων Δεδομένων',
        nameEN: 'Database Management Systems',
      },
      1402: {
        nameEL: 'Τηλεπικοινωνιακά Συστήματα',
        nameEN: 'Telecommunication Systems',
      },
      1403: {
        nameEL: 'Εισαγωγή στα Λειτουργικά Συστήματα',
        nameEN: 'Introduction to Operating Systems',
      },
      1404: {
        nameEL: 'Ηλεκτρονικά Κυκλώματα',
        nameEN: 'Electronic Circuits',
      },
      1304: {
        nameEL: 'Οργάνωση και Αρχιτεκτονική Υπολογιστικών Συστημάτων',
        nameEN: 'Computer System Organization and Architecture',
      },
    },
  },
  5: {
    courses: {
      1501: {
        nameEL: 'Ασύρματες Επικοινωνίες',
        nameEN: 'Wireless Communications',
      },
      1502: {
        nameEL: 'Μικροελεγκτές',
        nameEN: 'Microcontrollers',
      },
      1503: {
        nameEL: 'Σχεδίαση Λειτουργικών Συστημάτων',
        nameEN: 'Operating Systems Design',
      },
      1504: {
        nameEL: 'Ηλεκτρονικές Διατάξεις',
        nameEN: 'Electronic Devices',
      },
      1505: {
        nameEL: 'Αλληλεπίδραση Ανθρώπου-Μηχανής',
        nameEN: 'Human Machine Interaction',
      },
    },
  },
  6: {
    courses: {
      1601: {
        nameEL: 'Τεχνητή Νοημοσύνη',
        nameEN: 'Artificial Intelligence',
      },
      1602: {
        nameEL: 'Ενσωματωμένα Συστήματα',
        nameEN: 'Embedded Systems',
      },
      1611: {
        nameEL: 'Σύνθεση Ηλεκτρονικών Κυκλωμάτων',
        nameEN: 'Synthesis of electronic circuits',
      },
      1612: {
        nameEL: 'Κβαντική Υπολογιστική',
        nameEN: 'Quantum Computing',
      },
      1613: {
        nameEL: 'Μεθοδολογίες Σχεδιασμού Μικροηλεκτρονικών Κυκλωμάτων',
        nameEN: 'Microelectronic Circuit Design Methodologies',
      },
      1671: {
        nameEL: 'Μικροκυματική Τεχνολογία και Τηλεπισκόπηση',
        nameEN: 'Microwave Technology and Remote Sensing',
      },
      1672: {
        nameEL: 'Οπτοηλεκτρονική και Οπτικές Επικοινωνίες',
        nameEN: 'Optoelectronics and Optical Communications',
      },
      1673: {
        nameEL: 'Συστήματα Μέσων Μαζικής Επικοινωνίας',
        nameEN: 'Mass Media Communication Systems',
      },
      1641: {
        nameEL: 'Αριθμητικές Μέθοδοι',
        nameEN: 'Numerical Methods',
      },
      1642: {
        nameEL: 'Προηγμένα Θέματα Αλληλεπίδρασης (Προγραμματισμός Κινητών Συσκευών)',
        nameEN: 'Advanced Topics of Human Computer Interaction (Mobile Programming)',
      },
      1643: {
        nameEL: 'Διοίκηση Έργων',
        nameEN: 'Project Management',
      },
    },
  },
  7: {
    courses: {
      1701: {
        nameEL: 'Δίκτυα Υπολογιστών',
        nameEN: 'Computer Networks',
      },
      1702: {
        nameEL: 'Ηλεκτρονικά Ισχύος',
        nameEN: 'Power Electronics',
      },
      1711: {
        nameEL: 'Συστήματα Αυτομάτου Ελέγχου',
        nameEN: 'Control Systems',
      },
      1712: {
        nameEL: 'Αισθητήρια και Επεξεργασία Μετρήσεων',
        nameEN: 'Sensors Signal Contitioning',
      },
      1713: {
        nameEL: 'Προγραμματιζόμενοι Λογικοί Ελεγκτές',
        nameEN: 'Programmable Logic Controllers',
      },
      1714: {
        nameEL: 'Σχεδίαση Επαναπροσδιοριζόμενων Ψηφιακών Συστημάτων (FPGA)',
        nameEN: 'Design of Reconfigurable Digital Systems (FPGAs)',
      },
      1771: {
        nameEL: 'Τεχνολογίες Ήχου και Εικόνας',
        nameEN: 'Audio and Image Technologies',
      },
      1741: {
        nameEL: 'Εισαγωγή στην Αναλυτική των Δεδομένων',
        nameEN: 'Introduction to Data Analytics',
      },
      1742: {
        nameEL: 'Μηχανική Λογισμικού',
        nameEN: 'Software Engineering',
      },
      1743: {
        nameEL: 'Τεχνολογία Βάσεων Δεδομένων',
        nameEN: 'Database Technology',
      },
      1744: {
        nameEL: 'Προηγμένες Αρχιτεκτονικές Υπολογιστών και Προγραμματισμός Παράλληλων Συστημάτων',
        nameEN: 'Advanced Computer Architecture and Parallel System Programming',
      },
    },
  },
  8: {
    courses: {
      1801: {
        nameEL: 'Ασφάλεια Πληροφοριακών Συστημάτων',
        nameEN: 'Information Security',
      },
      1802: {
        nameEL: 'Αρχές και Μέθοδοι Μηχανικής Μάθησης',
        nameEN: 'Machine Learning Principles and Methods',
      },
      1803: {
        nameEL: 'Διαδίκτυο των Πραγμάτων',
        nameEN: 'Internet of Things',
      },
      1811: {
        nameEL: 'Εφαρμογές Συστημάτων Αυτομάτου Ελέγχου',
        nameEN: 'Applications of Control Systems',
      },
      1812: {
        nameEL: 'Μετατροπείς Ισχύος',
        nameEN: 'Power Converters',
      },
      1837: {
        nameEL: 'Μικροηλεκτρονική',
        nameEN: 'Microelectronics',
      },
      1838: {
        nameEL: 'Εφαρμογές Συστημάτων Ισχύος και ΑΠΕ',
        nameEN: 'Application of power systems and RES',
      },
      1839: {
        nameEL: 'Ηλεκτροκίνηση και Ευφυή Δίκτυα',
        nameEN: 'Motor drives and smart grid',
      },
      1871: {
        nameEL: 'Ασύρματα Δίκτυα',
        nameEN: 'Wireless networks',
      },
      1872: {
        nameEL: 'Ειδικά Θέματα Δικτύων (CCNA) 1',
        nameEN: 'Special Network Topics (CCNA) 1',
      },
      1873: {
        nameEL: 'Προηγμένα Θέματα Δικτύων',
        nameEN: 'Advanced Networking Topics',
      },
      1874: {
        nameEL: 'Συστήματα Κινητών Επικοινωνιών',
        nameEN: 'Mobile Communication Systems',
      },
      1841: {
        nameEL: 'Οργάνωση Δεδομένων και Εξόρυξη Πληροφορίας',
        nameEN: 'Data Organization and Data Mining',
      },
      1842: {
        nameEL: 'Διαδικτυακές Υπηρεσίες Προστιθέμενης Αξίας',
        nameEN: 'Added-Value Internet Services',
      },
      1948: {
        nameEL: 'Ανάπτυξη Ολοκληρωμένων Πληροφοριακών Συστημάτων',
        nameEN: 'Development of Large Software Systems',
      },
    },
  },
  9: {
    courses: {
      1911: {
        nameEL: 'Εφαρμογές Ενσωματωμένων Συστημάτων',
        nameEN: 'Applications of Embedded Systems',
      },
      1912: {
        nameEL: 'Ρομποτική',
        nameEN: 'Robotics',
      },
      1913: {
        nameEL: 'ΑΠΕ και Ευφυή Ηλεκτρικά Δίκτυα',
        nameEN: 'Renewable energy sources and smart grid',
      },
      1914: {
        nameEL: 'Απτικές Διεπαφές',
        nameEN: 'Tangible User Interfaces',
      },
      1915: {
        nameEL: 'Βιοϊατρική Τεχνολογία',
        nameEN: 'Biomedical Technology',
      },
      1916: {
        nameEL: 'Συστήματα Μετρήσεων Υποβοηθούμενων από Η/Υ',
        nameEN: 'Computer Assisted Measurement Systems',
      },
      1970: {
        nameEL: 'Πρακτική Άσκηση',
        nameEN: 'Internship',
      },
      1971: {
        nameEL: 'Ασφάλεια Δικτύων και Επικοινωνιών',
        nameEN: 'Network and Communication Security',
      },
      1972: {
        nameEL: 'Δικτύωση Καθορισμένη από Λογισμικό',
        nameEN: 'Software Defined Networking',
      },
      1973: {
        nameEL: 'Ειδικά Θέματα Δικτύων (CCNA) 2',
        nameEN: 'Special Network Topics (CCNA) 2',
      },
      1974: {
        nameEL: 'Δορυφορικές Επικοινωνίες',
        nameEN: 'Satellite Communications',
      },
      1975: {
        nameEL: 'Τεχνολογία Πολυμέσων',
        nameEN: 'Multimedia Technology',
      },
      1941: {
        nameEL: 'Ανάπτυξη Διαδικτυακών Συστημάτων και Εφαρμογών',
        nameEN: 'Development of Web Systems and Applications',
      },
      1942: {
        nameEL: 'Επιχειρησιακή Έρευνα',
        nameEN: 'Operational Research',
      },
      1943: {
        nameEL: 'Ανάκτηση Πληροφοριών – Μηχανές Αναζήτησης',
        nameEN: 'Information Retrieval – Search Engines',
      },
      1944: {
        nameEL: 'Διαχείριση Συστήματος και Υπηρεσιών DBMS',
        nameEN: 'DBMS Systems and Services Administration',
      },
      1945: {
        nameEL: 'Ευφυή Συστήματα',
        nameEN: 'Intelligent Systems',
      },
      1946: {
        nameEL: 'Προηγμένα Θέματα Τεχνητής Νοημοσύνης',
        nameEN: 'Artificial Intelligence – Advanced Topics',
      },
      1947: {
        nameEL: 'Προηγμένη Μηχανική Μάθηση',
        nameEN: 'Advanced Machine Learning',
      },
      1949: {
        nameEL: 'Κατανεμημένα Συστήματα',
        nameEN: 'Distributed Systems',
      },
      1950: {
        nameEL: 'Σημασιολογικός Ιστός',
        nameEN: 'Semantic Web',
      },
      1969: {
        nameEL: 'Γραφικά Υπολογιστών',
        nameEN: 'Computer Graphics',
      },
    },
  },
  10: {
    courses: {
      1999: {
        nameEL: 'Διπλωματική Εργασία',
        nameEN: 'Thesis',
      },
    },
  },
} as const

export interface ThinnedUser {
  id: string
  uid: string
  fullName: string
  fullNameEL: string
}
