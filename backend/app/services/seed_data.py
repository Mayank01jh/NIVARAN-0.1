"""
NIVARAN Emergency Network Seeder
Seeds realistic, production-grade hospitals, ambulances, and incidents across Delhi NCR.
"""
from __future__ import annotations

from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.logging import logger
from app.models.base import utcnow

DELHI_HOSPITALS = [
    {
        "_id": "hosp-aiims-01",
        "name": "AIIMS Apex Trauma Center",
        "location": {"type": "Point", "coordinates": [77.2066, 28.5684]},
        "address": "Choudhary Jhandu Singh Marg, Safdarjung Enclave, New Delhi 110029",
        "phone": "+91-11-26588500",
        "capabilities": ["LEVEL_1_TRAUMA", "CATH_LAB", "ICU", "NEURO", "BURN", "STROKE"],
        "helipad": True,
        "capacity": {
            "icu_total": 24,
            "icu_occupied": 18,
            "icu_available": 6,
            "acute_total": 40,
            "acute_occupied": 32,
            "acute_available": 8,
            "trauma_bays_total": 8,
            "trauma_bays_available": 3,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 14,
            "blood_units_a_pos": 28,
            "blood_units_b_pos": 35,
        },
    },
    {
        "_id": "hosp-safdarjung-02",
        "name": "Safdarjung Hospital Emergency",
        "location": {"type": "Point", "coordinates": [77.2078, 28.5702]},
        "address": "Ring Road, Opposite AIIMS, Ansari Nagar West, New Delhi 110029",
        "phone": "+91-11-26165060",
        "capabilities": ["LEVEL_1_TRAUMA", "BURN", "ICU", "PEDIATRIC", "TOXICOLOGY"],
        "helipad": False,
        "capacity": {
            "icu_total": 20,
            "icu_occupied": 16,
            "icu_available": 4,
            "acute_total": 60,
            "acute_occupied": 48,
            "acute_available": 12,
            "trauma_bays_total": 6,
            "trauma_bays_available": 2,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 10,
            "blood_units_a_pos": 22,
            "blood_units_b_pos": 30,
        },
    },
    {
        "_id": "hosp-apollo",
        "name": "Indraprastha Apollo Hospital",
        "location": {"type": "Point", "coordinates": [77.2832, 28.5398]},
        "address": "Delhi-Mathura Road, Sarita Vihar, New Delhi 110076",
        "phone": "+91-11-26925858",
        "capabilities": ["LEVEL_1_TRAUMA", "CATH_LAB", "ICU", "STROKE", "ORGAN_TRANSPLANT"],
        "helipad": True,
        "capacity": {
            "icu_total": 30,
            "icu_occupied": 22,
            "icu_available": 8,
            "acute_total": 50,
            "acute_occupied": 38,
            "acute_available": 12,
            "trauma_bays_total": 6,
            "trauma_bays_available": 4,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 18,
            "blood_units_a_pos": 34,
            "blood_units_b_pos": 42,
        },
    },
    {
        "_id": "hosp-max",
        "name": "Max Super Speciality Hospital (Saket)",
        "location": {"type": "Point", "coordinates": [77.2131, 28.5284]},
        "address": "1, 2, Press Enclave Marg, Saket District Centre, New Delhi 110017",
        "phone": "+91-11-26515050",
        "capabilities": ["LEVEL_2_TRAUMA", "CATH_LAB", "ICU", "NEURO", "STROKE"],
        "helipad": False,
        "capacity": {
            "icu_total": 18,
            "icu_occupied": 13,
            "icu_available": 5,
            "acute_total": 35,
            "acute_occupied": 27,
            "acute_available": 8,
            "trauma_bays_total": 4,
            "trauma_bays_available": 2,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 12,
            "blood_units_a_pos": 20,
            "blood_units_b_pos": 25,
        },
    },
    {
        "_id": "hosp-rml-05",
        "name": "Dr. Ram Manohar Lohia (RML) Hospital",
        "location": {"type": "Point", "coordinates": [77.2016, 28.6253]},
        "address": "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
        "phone": "+91-11-23365525",
        "capabilities": ["LEVEL_1_TRAUMA", "ICU", "CARDIAC", "TOXICOLOGY"],
        "helipad": False,
        "capacity": {
            "icu_total": 22,
            "icu_occupied": 17,
            "icu_available": 5,
            "acute_total": 45,
            "acute_occupied": 36,
            "acute_available": 9,
            "trauma_bays_total": 5,
            "trauma_bays_available": 3,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 15,
            "blood_units_a_pos": 25,
            "blood_units_b_pos": 32,
        },
    },
    {
        "_id": "hosp-gangaram-06",
        "name": "Sir Ganga Ram Hospital",
        "location": {"type": "Point", "coordinates": [77.1895, 28.6385]},
        "address": "Sir Ganga Ram Hospital Marg, Old Rajinder Nagar, New Delhi 110060",
        "phone": "+91-11-25750000",
        "capabilities": ["LEVEL_1_TRAUMA", "CATH_LAB", "ICU", "NEPHROLOGY", "ORGAN_TRANSPLANT"],
        "helipad": False,
        "capacity": {
            "icu_total": 20,
            "icu_occupied": 15,
            "icu_available": 5,
            "acute_total": 40,
            "acute_occupied": 30,
            "acute_available": 10,
            "trauma_bays_total": 5,
            "trauma_bays_available": 2,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 16,
            "blood_units_a_pos": 26,
            "blood_units_b_pos": 30,
        },
    },
    {
        "_id": "hosp-lnjp-07",
        "name": "Lok Nayak Jai Prakash (LNJP) Hospital",
        "location": {"type": "Point", "coordinates": [77.2403, 28.6369]},
        "address": "Jawaharlal Nehru Marg, Delhi Gate, New Delhi 110002",
        "phone": "+91-11-23233000",
        "capabilities": ["LEVEL_1_TRAUMA", "BURN", "ICU", "PEDIATRIC"],
        "helipad": False,
        "capacity": {
            "icu_total": 25,
            "icu_occupied": 20,
            "icu_available": 5,
            "acute_total": 55,
            "acute_occupied": 44,
            "acute_available": 11,
            "trauma_bays_total": 6,
            "trauma_bays_available": 2,
            "cath_lab_operational": False,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 12,
            "blood_units_a_pos": 20,
            "blood_units_b_pos": 28,
        },
    },
    {
        "_id": "hosp-fortis",
        "name": "Fortis Escorts Heart Institute",
        "location": {"type": "Point", "coordinates": [77.2762, 28.5606]},
        "address": "Okhla Road, Sukhdev Vihar, New Delhi 110025",
        "phone": "+91-11-47135000",
        "capabilities": ["CATH_LAB", "CARDIAC", "ICU", "ECMO", "HEART_FAILURE"],
        "helipad": False,
        "capacity": {
            "icu_total": 16,
            "icu_occupied": 11,
            "icu_available": 5,
            "acute_total": 30,
            "acute_occupied": 21,
            "acute_available": 9,
            "trauma_bays_total": 4,
            "trauma_bays_available": 2,
            "cath_lab_operational": True,
            "ct_scanner_operational": True,
            "trauma_team_standby": True,
            "diversion_active": False,
            "diversion_status": "NORMAL",
            "blood_units_o_neg": 10,
            "blood_units_a_pos": 18,
            "blood_units_b_pos": 22,
        },
    },
]

DELHI_AMBULANCES = [
    {
        "_id": "amb-delhi-1081",
        "registration": "DL-01-AMB-1081",
        "operator_id": "Delhi-EMS-Central",
        "status": "EN_ROUTE",
        "capabilities": ["ALS", "VENTILATOR", "DEFIBRILLATOR", "TELEMETRY_12_LEAD"],
        "crew": [
            {"name": "Rajesh Kumar", "role": "lead_paramedic", "phone": "+91 98101 23456"},
            {"name": "Dr. S. Rao", "role": "emergency_physician", "phone": "+91 98101 23457"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2090, 28.5670]},
        "location": {"type": "Point", "coordinates": [77.2090, 28.5670]},
        "heading_deg": 45.0,
        "speed_kmh": 42.0,
        "active_incident_id": "inc-demo-cardiac-01",
    },
    {
        "_id": "amb-delhi-1082",
        "registration": "DL-02-AMB-1082",
        "operator_id": "Delhi-EMS-South",
        "status": "EN_ROUTE",
        "capabilities": ["ALS", "TRAUMA", "BLOOD_WARMER", "VENTILATOR"],
        "crew": [
            {"name": "Vikram Singh", "role": "lead_paramedic", "phone": "+91 98102 34567"},
            {"name": "Anjali Sharma", "role": "critical_care_rn", "phone": "+91 98102 34568"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2140, 28.5720]},
        "location": {"type": "Point", "coordinates": [77.2140, 28.5720]},
        "heading_deg": 180.0,
        "speed_kmh": 38.0,
        "active_incident_id": "inc-demo-trauma-02",
    },
    {
        "_id": "amb-delhi-1083",
        "registration": "DL-03-AMB-1083",
        "operator_id": "Delhi-EMS-Central",
        "status": "AVAILABLE",
        "capabilities": ["BLS", "AED", "OXYGEN_KIT", "SPINAL_BOARD"],
        "crew": [
            {"name": "Manoj Verma", "role": "emt_basic", "phone": "+91 98103 45678"},
            {"name": "Amit Rawat", "role": "driver_responder", "phone": "+91 98103 45679"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2185, 28.6290]},
        "location": {"type": "Point", "coordinates": [77.2185, 28.6290]},
        "heading_deg": 90.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
    {
        "_id": "amb-delhi-1084",
        "registration": "DL-04-AMB-1084",
        "operator_id": "Delhi-EMS-West",
        "status": "AVAILABLE",
        "capabilities": ["ALS", "CARDIAC_MONITOR", "NEBULIZER", "CPAP"],
        "crew": [
            {"name": "Preeti Deshmukh", "role": "lead_paramedic", "phone": "+91 98104 56789"},
            {"name": "Sunil Yadav", "role": "emt_intermediate", "phone": "+91 98104 56790"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2120, 28.5295]},
        "location": {"type": "Point", "coordinates": [77.2120, 28.5295]},
        "heading_deg": 270.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
    {
        "_id": "amb-delhi-1085",
        "registration": "DL-05-AMB-1085",
        "operator_id": "Delhi-EMS-East",
        "status": "AVAILABLE",
        "capabilities": ["BLS", "AED", "SPLINTS", "TRAUMA_FIRST_AID"],
        "crew": [
            {"name": "Deepak Sharma", "role": "emt_basic", "phone": "+91 98105 67890"},
            {"name": "R. K. Gujral", "role": "driver_responder", "phone": "+91 98105 67891"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2790, 28.5420]},
        "location": {"type": "Point", "coordinates": [77.2790, 28.5420]},
        "heading_deg": 120.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
    {
        "_id": "amb-delhi-1086",
        "registration": "DL-06-AMB-1086",
        "operator_id": "Delhi-EMS-North",
        "status": "AVAILABLE",
        "capabilities": ["ALS", "VENTILATOR", "ECG_12_LEAD", "DEFIBRILLATOR"],
        "crew": [
            {"name": "Harish Pant", "role": "lead_paramedic", "phone": "+91 98106 78901"},
            {"name": "Neha Tyagi", "role": "critical_care_rn", "phone": "+91 98106 78902"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.1880, 28.6370]},
        "location": {"type": "Point", "coordinates": [77.1880, 28.6370]},
        "heading_deg": 0.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
    {
        "_id": "amb-delhi-1087",
        "registration": "DL-07-AMB-1087",
        "operator_id": "Delhi-EMS-Trauma-Reserve",
        "status": "AVAILABLE",
        "capabilities": ["MICU", "HIGH_FLOW_O2", "ULTRASOUND_FAST", "INFUSION_PUMP"],
        "crew": [
            {"name": "Dr. Varun Sethi", "role": "emergency_physician", "phone": "+91 98107 89012"},
            {"name": "Tariq Khan", "role": "lead_paramedic", "phone": "+91 98107 89013"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2060, 28.5695]},
        "location": {"type": "Point", "coordinates": [77.2060, 28.5695]},
        "heading_deg": 60.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
    {
        "_id": "amb-delhi-1088",
        "registration": "DL-08-AMB-1088",
        "operator_id": "Delhi-EMS-Central",
        "status": "AVAILABLE",
        "capabilities": ["BLS", "AED", "HEMORRHAGE_CONTROL"],
        "crew": [
            {"name": "Suresh Mehra", "role": "emt_basic", "phone": "+91 98108 90123"},
            {"name": "Kapil Dev", "role": "driver_responder", "phone": "+91 98108 90124"},
        ],
        "current_location": {"type": "Point", "coordinates": [77.2390, 28.6355]},
        "location": {"type": "Point", "coordinates": [77.2390, 28.6355]},
        "heading_deg": 210.0,
        "speed_kmh": 0.0,
        "active_incident_id": None,
    },
]

DELHI_INCIDENTS = [
    {
        "_id": "inc-demo-cardiac-01",
        "caller_id": "caller-9876543210",
        "idempotency_key": "demo-cardiac-01",
        "request_hash": "hash-cardiac-01",
        "location": {"type": "Point", "coordinates": [77.2195, 28.6315]},
        "accuracy_m": 8.0,
        "address": "Inner Circle, Connaught Place, Block B, New Delhi",
        "severity": "CRITICAL",
        "status": "EN_ROUTE",
        "caller_info": {
            "name": "Ramesh Gupta",
            "phone": "+91 98765 43210",
            "notes": "🔴 CRITICAL: Acute crushing retrosternal pain, radiating to left arm. Diaphoresis, SpO2 91%. Cath Lab standby requested.",
        },
        "assigned_unit_id": "amb-delhi-1081",
        "destination_hospital_id": "hosp-aiims-01",
        "destination_hospital_name": "AIIMS Apex Trauma Center",
        "eta_seconds": 210,
    },
    {
        "_id": "inc-demo-trauma-02",
        "caller_id": "caller-9811223344",
        "idempotency_key": "demo-trauma-02",
        "request_hash": "hash-trauma-02",
        "location": {"type": "Point", "coordinates": [77.2075, 28.5714]},
        "accuracy_m": 12.0,
        "address": "Safdarjung Flyover, Ring Road Northbound",
        "severity": "CRITICAL",
        "status": "EN_ROUTE",
        "caller_info": {
            "name": "Pooja Sharma",
            "phone": "+91 98112 23344",
            "notes": "🔴 CRITICAL: High-speed collision. Suspected tension hemothorax and compound lower extremity fracture. Immediate resuscitation bay requested.",
        },
        "assigned_unit_id": "amb-delhi-1082",
        "destination_hospital_id": "hosp-safdarjung-02",
        "destination_hospital_name": "Safdarjung Hospital Emergency",
        "eta_seconds": 340,
    },
    {
        "_id": "inc-demo-asthma-03",
        "caller_id": "caller-9899112233",
        "idempotency_key": "demo-asthma-03",
        "request_hash": "hash-asthma-03",
        "location": {"type": "Point", "coordinates": [77.2155, 28.5262]},
        "accuracy_m": 15.0,
        "address": "Saket District Centre, Near Select CityWalk",
        "severity": "HIGH",
        "status": "QUEUED",
        "caller_info": {
            "name": "Ananya Roy",
            "phone": "+91 98991 12233",
            "notes": "🟠 HIGH: Status asthmaticus. Severe refractory wheezing, tachypnea (RR 32), SpO2 89%. DuoNeb initiated.",
        },
        "assigned_unit_id": None,
        "destination_hospital_id": "hosp-max",
        "destination_hospital_name": "Max Super Speciality Hospital (Saket)",
        "eta_seconds": 480,
    },
    {
        "_id": "inc-demo-fall-04",
        "caller_id": "caller-9711002233",
        "idempotency_key": "demo-fall-04",
        "request_hash": "hash-fall-04",
        "location": {"type": "Point", "coordinates": [77.2830, 28.5410]},
        "accuracy_m": 14.0,
        "address": "Pocket A, Sarita Vihar, Near Apollo Metro Station",
        "severity": "HIGH",
        "status": "VALIDATING",
        "caller_info": {
            "name": "Sanjay Verma",
            "phone": "+91 97110 02233",
            "notes": "🟠 HIGH: Elderly fall with acute onset right hemiparesis and facial asymmetry. Last seen normal: 40 min ago. Code Stroke protocol.",
        },
        "assigned_unit_id": None,
        "destination_hospital_id": "hosp-apollo",
        "destination_hospital_name": "Indraprastha Apollo Hospital",
        "eta_seconds": 590,
    },
]

DELHI_PRE_ALERTS = [
    {
        "_id": "ALT-1081-STEMI",
        "alert_id": "ALT-1081-STEMI",
        "incident_id": "inc-demo-cardiac-01",
        "hospital_id": "hosp-aiims-01",
        "ambulance_id": "DL-01-AMB-1081",
        "triage_category": "RED",
        "eta_seconds": 210,
        "suspected_condition": "Acute Anterior STEMI / Cardiogenic Shock",
        "vitals": {
            "heart_rate": 118,
            "blood_pressure": "85/55",
            "spo2_pct": 91,
            "respiratory_rate": 26,
            "gcs": 14,
        },
        "notes": "Aspirin 325mg and Heparin administered. ST-elevation in V1-V4. Cath lab activation and Trauma Bay 1 standby requested.",
        "created_at": utcnow(),
        "acknowledged_at": None,
    },
    {
        "_id": "ALT-1082-TRAUMA",
        "alert_id": "ALT-1082-TRAUMA",
        "incident_id": "inc-demo-trauma-02",
        "hospital_id": "hosp-safdarjung-02",
        "ambulance_id": "DL-02-AMB-1082",
        "triage_category": "RED",
        "eta_seconds": 340,
        "suspected_condition": "High-Speed Vehicular Collision / Tension Hemothorax",
        "vitals": {
            "heart_rate": 128,
            "blood_pressure": "90/58",
            "spo2_pct": 93,
            "respiratory_rate": 28,
            "gcs": 13,
        },
        "notes": "Needle decompression performed right 2nd ICS. Pelvic binder placed. Massive Transfusion Protocol standby.",
        "created_at": utcnow(),
        "acknowledged_at": None,
    },
    {
        "_id": "ALT-1083-ASTHMA",
        "alert_id": "ALT-1083-ASTHMA",
        "incident_id": "inc-demo-asthma-03",
        "hospital_id": "hosp-max",
        "ambulance_id": "DL-04-AMB-1084",
        "triage_category": "YELLOW",
        "eta_seconds": 480,
        "suspected_condition": "Status Asthmaticus / Severe Bronchospasm",
        "vitals": {
            "heart_rate": 104,
            "blood_pressure": "136/84",
            "spo2_pct": 89,
            "respiratory_rate": 32,
            "gcs": 15,
        },
        "notes": "Continuous DuoNeb nebulization ongoing. High-flow oxygen 10L. Resuscitation bay BiPAP requested.",
        "created_at": utcnow(),
        "acknowledged_at": None,
    },
    {
        "_id": "ALT-1084-STROKE",
        "alert_id": "ALT-1084-STROKE",
        "incident_id": "inc-demo-fall-04",
        "hospital_id": "hosp-apollo",
        "ambulance_id": "DL-03-AMB-1083",
        "triage_category": "YELLOW",
        "eta_seconds": 590,
        "suspected_condition": "Suspected Ischemic Stroke with Ground-Level Fall",
        "vitals": {
            "heart_rate": 84,
            "blood_pressure": "155/92",
            "spo2_pct": 97,
            "respiratory_rate": 18,
            "gcs": 14,
        },
        "notes": "Left-sided facial droop and arm drift noted. Last seen normal: 40 min ago. Code Stroke & CT Head requested.",
        "created_at": utcnow(),
        "acknowledged_at": None,
    },
]


async def seed_emergency_network(db: AsyncIOMotorDatabase, force: bool = False) -> dict:
    """Populates Delhi NCR emergency grid data into MongoDB."""
    now = utcnow()
    now_iso = now.isoformat()

    hospital_count = await db.hospitals.count_documents({})
    ambulance_count = await db.ambulances.count_documents({})

    if not force and hospital_count >= len(DELHI_HOSPITALS) and ambulance_count >= len(DELHI_AMBULANCES):
        logger.info("Emergency grid already populated; skipping seed.")
        return {
            "status": "already_populated",
            "hospitals": hospital_count,
            "ambulances": ambulance_count,
        }

    # 1. Upsert Hospitals
    for h in DELHI_HOSPITALS:
        doc = dict(h)
        doc["updated_at"] = now
        await db.hospitals.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)

    # 2. Upsert Ambulances
    for amb in DELHI_AMBULANCES:
        doc = dict(amb)
        doc["created_at"] = doc.get("created_at", now)
        doc["updated_at"] = now
        doc["last_seen_at"] = now_iso
        await db.ambulances.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)

    # 3. Upsert Incidents
    for inc in DELHI_INCIDENTS:
        doc = dict(inc)
        doc["received_at"] = doc.get("received_at", now_iso)
        doc["updated_at"] = now_iso
        await db.incidents.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)

    # 4. Upsert Pre-Alerts
    for pa in DELHI_PRE_ALERTS:
        doc = dict(pa)
        doc["created_at"] = doc.get("created_at", now_iso)
        doc["updated_at"] = now_iso
        await db.pre_alerts.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)

    logger.info(
        "Emergency grid successfully seeded",
        hospitals=len(DELHI_HOSPITALS),
        ambulances=len(DELHI_AMBULANCES),
        incidents=len(DELHI_INCIDENTS),
        pre_alerts=len(DELHI_PRE_ALERTS),
    )

    return {
        "status": "seeded",
        "hospitals_seeded": len(DELHI_HOSPITALS),
        "ambulances_seeded": len(DELHI_AMBULANCES),
        "incidents_seeded": len(DELHI_INCIDENTS),
        "pre_alerts_seeded": len(DELHI_PRE_ALERTS),
    }

