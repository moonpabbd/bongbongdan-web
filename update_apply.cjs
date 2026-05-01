const fs = require('fs');
const file = '/Users/dasoda/Desktop/봉봉단 홈페이지/src/app/pages/ApplyVolunteer.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. imports
content = content.replace(
  "import { useAuth } from '../context/AuthContext';",
  "import { useAuth } from '../context/AuthContext';\nimport { prefetchRecord } from '../../utils/apiCache';"
);

// 2. formData and states
content = content.replace(
  "    date: '',                 // 1. 어느 날짜에 참여하시겠소?",
  "    date: '',                 // 1. 어느 날짜에 참여하시겠소?\n    q1: '',                   // 1. 어느 모임에 참여하시나요? (모임)"
);
content = content.replace(
  "    isFirstTime: '',          // 6. 봉봉단에 처음 오시나요?",
  "    q6: '',                   // 6. 봉사 신청한 횟수가 몇 번인가요? (모임)\n    isFirstTime: '',          // 6. 봉봉단에 처음 오시나요?"
);
content = content.replace(
  "  const [activeTab, setActiveTab] = useState('dog');\n",
  "  const [activeTab, setActiveTab] = useState('dog');\n  const [userVolCount, setUserVolCount] = useState<number | null>(null);\n"
);
content = content.replace(
  "  type VolunteerDateOption = {\n",
  "  type GatheringOption = {\n    name: string;\n    leader: string;\n    fee: string;\n    minCount: number;\n    capacity: number;\n    current: number;\n    remaining: number;\n    location: string;\n    notice: string;\n    scheduleDesc: string;\n  };\n  type VolunteerDateOption = {\n"
);
content = content.replace(
  "  const [isLoadingDates, setIsLoadingDates] = useState(true);\n",
  "  const [gatherings, setGatherings] = useState<GatheringOption[]>([]);\n  const [isLoadingDates, setIsLoadingDates] = useState(true);\n"
);

// 3. fetchDates
content = content.replace(
  "        if (data && data.dates) {\n          setAvailableDates(data.dates);\n        } else {",
  "        if (data && data.dates) {\n          setAvailableDates(data.dates);\n        }\n        if (data && data.gatherings) {\n          setGatherings(data.gatherings);\n        } else {"
);

// 4. prefetchRecord
content = content.replace(
  "        q16: prev.q16 || profile.kakaoId || profile.kakao_id || ''\n      }));\n    }\n  }, [profile]);",
  "        q16: prev.q16 || profile.kakaoId || profile.kakao_id || ''\n      }));\n\n      if (profile.name && profile.phone && profile.birthdate) {\n        prefetchRecord(profile.name, profile.phone, profile.birthdate)\n          .then(data => {\n            if (data && data.totalCount !== undefined) setUserVolCount(data.totalCount);\n            else if (data && data.count !== undefined) setUserVolCount(data.count);\n          })\n          .catch(() => {});\n      }\n    }\n  }, [profile]);"
);

fs.writeFileSync(file, content);
console.log('Phase 1 done');
