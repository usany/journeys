import { useTheme } from "@/contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { busCollection } from "./busCollection";

export const BusTimelineSkeleton = () => {
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);
  
  return (
    <View style={styles.timelineContainer}>
      <View style={styles.timelineLine} />
      <View style={styles.timelineContentBus}>
        {skeletonItems.map((index) => (
          <View key={index} style={styles.busStepContainer}>
            <View style={styles.busIconWrappeaar}>
              <View style={styles.busIconInner}>
                <View style={[styles.busStopIcon, styles.skeletonIcon]} />
              </View>
            </View>
            <View style={styles.stepTextContainer}>
              <View style={[styles.skeletonText, styles.skeletonTitle]} />
              <View style={[styles.skeletonText, styles.skeletonSubtitle]} />
              <View style={[styles.skeletonText, styles.skeletonData]} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Global flag to prevent multiple fetches across component remounts
// let globalHasFetched = false;
const builduseSeoulBusQuery = (id: number[]) => `
  query {
    seoulBusArrival(routeIds: [${id.join(',')}]) {
      response {
        msgBody {
          itemList {
            arrmsg1
            rtNm
            firstTm
            lastTm
            term
            stNm
          }
        }
      }
    }
  }
`;

const buildGyeonggiBusRouteQuery = (id: number[]) => `
  query {
    gyeonggiBusRoute(routeIds: [${id.join(',')}]) {
      response {
        msgBody {
          busRouteInfoItem {
            routeName
            upFirstTime
            upLastTime
            peekAlloc
            nPeekAlloc
            satPeekAlloc
            satNPeekAlloc
            sunPeekAlloc
            sunNPeekAlloc
            wePeekAlloc
            weNPeekAlloc
          }
        }
      }
    }
  }
`;

const Schedule = () => {
  const pathname = usePathname();
  const [busData, setBusData] = useState<any[]>([]);
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const hasFetched = useRef(false);
  const campus = pathname.includes('se') ? 'seoul' : pathname.includes('gw') ? 'gwangneung' : 'global';
  const selectedBus = busCollection[campus];
  const { colors } = useTheme();
  
  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  
  const fetchBus = async (id: number[]) => {
    if (pathname.includes('se')) {
      // const response = await fetch(`http://localhost:5000/graphql`, {
      // const response = await fetch(`https://qlroute.onrender.com/graphql`, {
      const response = await fetch(`https://routes-xlbe.vercel.app/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: builduseSeoulBusQuery(id),
        }),
      });
      const data = await response.json();
      const res = data.data.seoulBusArrival.map((item: any) => item.response.msgBody.itemList[5]);
      return res;
    }
    console.log('id', id)
    try {
      // const response = await fetch(`http://localhost:5000/graphql`, {
      // const response = await fetch(`https://qlroutes.onrender.com/graphql`, {
      const response = await fetch(`https://routes-xlbe.vercel.app/graphql`, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: buildGyeonggiBusRouteQuery(id),
        }),
      });
      const data = await response.json();
      const res = data.data.gyeonggiBusRoute.map((item: any) => item.response.msgBody.busRouteInfoItem);
      return res
    } catch (error) {
      console.error('Error fetching bus data:', error);
      return null;
    }
  }

  useEffect(() => {
    // console.log('Schedule useEffect triggered, globalHasFetched:', globalHasFetched);
    // if (globalHasFetched) return;
    
    const fetchAllBuses = async () => {
      console.log('Starting fetch...');
      if (selectedBus) {
        const busRoutes = Object.values(selectedBus);
        // const promises = busRoutes.map((routeId: number) => fetchBus(routeId));
        // const results = await Promise.all(promises);
        const results = await fetchBus(busRoutes)
        console.log('results', results)
        // const allBusData = results.flat();
        if (results) {
          setBusData(results);
        }
      }
    };
    
    fetchAllBuses();
  }, []);
  
    console.log('Schedule render, busData length:', busData.length);
    const renderContent = (bus: any, index: number) => {
    const routeName = bus.rtNm;
    const upFirstTime = bus.firstTm.slice(8, 10) + ':' + bus.firstTm.slice(10, 11)+'0';
    const upLastTime = bus.lastTm.slice(8, 10) + ':' + bus.lastTm.slice(10, 11)+'0';
    const peekAlloc = bus.term;
    
    return (
      <View key={index} style={[styles.busItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.busItemHeader}>
          <View style={styles.busItemHeaderLeft}>
            <View style={[styles.busNumber, { backgroundColor: colors.primary }]}> 
              <Text style={[styles.busNumberText, { color: colors.card }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.routeName, { color: colors.text }]}>{routeName}</Text>
          </View>
          <Text style={[styles.timeText, { color: colors.icon }]}>{upFirstTime}~{upLastTime}</Text>
        </View>

        <View style={[styles.busItemContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.icon} />
            <Text style={[styles.infoLabel, { color: colors.text }]}>운행시간</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{upFirstTime}~{upLastTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.icon} />
            <Text style={[styles.infoLabel, { color: colors.text }]}>배차간격</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{peekAlloc}분</Text>
          </View>
        </View>
      </View>
    );
  }

  const renderAccordionContent = (bus: any, index: number) => {
    const routeName = bus.routeName;
    const upFirstTime = bus.upFirstTime;
    const upLastTime = bus.upLastTime;
    const peekAlloc = bus.peekAlloc;
    const nPeekAlloc = bus.nPeekAlloc;
    const satPeekAlloc = bus.satPeekAlloc;
    const satNPeekAlloc = bus.satNPeekAlloc;
    const sunPeekAlloc = bus.sunPeekAlloc;
    const sunNPeekAlloc = bus.sunNPeekAlloc;
    const wePeekAlloc = bus.wePeekAlloc;
    const weNPeekAlloc = bus.weNPeekAlloc;
    const isOpen = openAccordions.has(index);
    
    return (
      <View key={index} style={[styles.accordionItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => toggleAccordion(index)}
          style={[styles.accordionHeader, { backgroundColor: colors.card }]}
        >
          <View style={styles.accordionHeaderLeft}>
            <View style={[styles.busNumber, { backgroundColor: colors.primary }]}>
              <Text style={[styles.busNumberText, { color: colors.card }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.routeName, { color: colors.text }]}>{routeName}</Text>
          </View>
          <View style={styles.accordionHeaderRight}>
            <Text style={[styles.timeText, { color: colors.icon }]}>{upFirstTime}~{upLastTime}</Text>
            <Ionicons 
              name={isOpen ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={colors.icon} 
            />
          </View>
        </TouchableOpacity>
        
        {isOpen && (
          <View style={[styles.accordionContent, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={colors.icon} />
              <Text style={[styles.infoLabel, { color: colors.text }]}>운행시간</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{upFirstTime}~{upLastTime}</Text>
            </View>
            
            <View style={styles.scheduleSection}>
              <View style={styles.scheduleHeader}>
                <Ionicons name="calendar-outline" size={16} color={colors.icon} />
                <Text style={[styles.infoLabel, { color: colors.text }]}>배차간격</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <View style={styles.scheduleRow}>
                  <Text style={[styles.scheduleLabel, { color: colors.icon }]}>평일:</Text>
                  <Text style={[styles.scheduleValue, { color: colors.text }]}>{peekAlloc}~{nPeekAlloc}분</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={[styles.scheduleLabel, { color: colors.icon }]}>토요일:</Text>
                  <Text style={[styles.scheduleValue, { color: colors.text }]}>{satPeekAlloc}~{satNPeekAlloc}분</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={[styles.scheduleLabel, { color: colors.icon }]}>일요일:</Text>
                  <Text style={[styles.scheduleValue, { color: colors.text }]}>{sunPeekAlloc}~{sunNPeekAlloc}분</Text>
                </View>
                <View style={styles.scheduleRow}>
                  <Text style={[styles.scheduleLabel, { color: colors.icon }]}>공휴일:</Text>
                  <Text style={[styles.scheduleValue, { color: colors.text }]}>{wePeekAlloc}~{weNPeekAlloc}분</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setIsDrawerOpen(true)}
          style={[styles.scheduleButton, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.scheduleTitle, { color: colors.text }]}>버스 시간표</Text>
          <Text style={[styles.scheduleSubtitle, { color: colors.icon }]}>클릭하여 전체 버스 시간표 보기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isDrawerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>버스 시간표</Text>
            <TouchableOpacity
              onPress={() => setIsDrawerOpen(false)}
              style={[styles.closeButton, { backgroundColor: colors.card }]}
            >
              <Ionicons name="chevron-down" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.busList}>
              {busData.map((bus: any, index: number) =>
                pathname.includes('se') ? renderContent(bus, index) : renderAccordionContent(bus, index)
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
  },
  scheduleButton: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  busList: {
    padding: 16,
    gap: 8,
  },
  
  // Accordion styles
  accordionItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#dbeafe',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busNumberText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  routeName: {
    fontWeight: '500',
    fontSize: 16,
  },
  accordionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  
  accordionContent: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontWeight: '500',
    fontSize: 16,
  },
  infoValue: {
    color: '#374151',
    fontSize: 16,
  },
  
  scheduleSection: {
    gap: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleDetails: {
    gap: 4,
    paddingLeft: 24,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  scheduleValue: {
    color: '#1f2937',
    fontSize: 14,
  },
  
  // Bus item styles for Seoul campus
  busItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  busItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  busItemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  busItemContent: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  
  // Timeline styles for BusTimelineSkeleton
  timelineContainer: { position: 'relative', width: '100%' },
  timelineLine: { position: 'absolute', left: 60, top: 0, bottom: 0, width: 4, backgroundColor: '#d1d5db' },
  timelineContentBus: { position: 'relative', flexDirection: 'column', gap: 32, paddingLeft: 32, paddingTop: 20, width: '100%' },
  busStepContainer: { gap: 24, flexDirection: 'row' },
  busIconWrappeaar: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 64 },
  busIconInner: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  busStopIcon: { width: 64, height: 64, backgroundColor: '#2563eb', borderRadius: 9999, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  stepTextContainer: { textAlign: 'left', maxWidth: 448, flex: 1, justifyContent: 'flex-end' },
  
  // Skeleton loading styles
  skeletonIcon: { backgroundColor: '#e5e7eb' },
  skeletonText: { backgroundColor: '#e5e7eb', borderRadius: 4 },
  skeletonTitle: { width: 200, height: 20, marginBottom: 8 },
  skeletonSubtitle: { width: 150, height: 16, marginBottom: 8 },
  skeletonData: { width: 100, height: 14 },
});

export default Schedule;