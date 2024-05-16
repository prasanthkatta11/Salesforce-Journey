public class BusScheduleCache {
	private Cache.OrgPartition part;
    public BusScheduleCache(){
        part = new cache.orgPartition('local.BusSchedule');
    }
    public void putSchedule(String busline, Time[] schedule){
        if(part !=null){
            part.put('busLine', schedule);
        }
    }
    public Time[] getSchedule(String busline){
        Time[] Schedule = (Time[])part.get(busLine);
        if(schedule!=null){
        	return Schedule;
        }else{
            return new List<Time>{Time.newInstance(8,0,0,0),Time.newInstance(17,0,0,0)};
        }   
        }
    }