# 사용자가 반납신청한 건을 제외한 예약서버 찾기
select r.id, r.serverId, r.start, r.end, name as serverName, os as serverOS from servers s join reservations r on s.id = r.serverId where r.userId=:userId and r.applyOk=1 and not exists ( select ret.reservationId from returns ret where r.id=ret.reservationId );

# 해당 날짜에 이용가능한 서버 찾기
select id, name, os, cpu, ram from servers s where s.id not in (select r.serverId from reservations r where r.applyOk!=2 and (:start<=end and start<=:end) );

# 서버 예약 날짜 (두달간)
select serverId, CASE WHEN start<'2020-11-20' and '2020-11-20'<=end THEN '2020-11-20' WHEN '2020-11-20' <=start and start<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) THEN start END as start, CASE WHEN '2020-11-20' <=end and end<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) THEN end WHEN start<=DATE_ADD('2020-11-20', INTERVAL 2 MONTH) and DATE_ADD('2020-11-20', INTERVAL 2 MONTH)<end THEN DATE_ADD('2020-11-20', INTERVAL 2 MONTH) END as end from reservations where serverId=:serverId and applyOk!=2 and end>='2020-11-20';

# 서버 예약 현황
select r.id, r.start, r.end, r.serverId, u.name, u.department, IF ( EXISTS (select reservationId from returns where applyOk=1 and r.id=reservationId), 1, 0) as returnOK from users u join reservations r on u.userId = r.userId where r.applyOk=1;
