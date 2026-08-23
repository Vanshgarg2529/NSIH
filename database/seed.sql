-- GOVINNOVATE Database Seed Data

-- Clear existing data
DELETE FROM audit_logs;
DELETE FROM procurement;
DELETE FROM evidence_passports;
DELETE FROM evidence;
DELETE FROM kpis;
DELETE FROM pilots;
DELETE FROM matches;
DELETE FROM solutions;
DELETE FROM startups;
DELETE FROM challenges;
DELETE FROM users;

-- Demo Users (Password: demo123 -> bcrypt hash $2a$10$vN91xYk0YjA.Z.0wU9fMteYJ3e2E7W3m1L5k8r2y7)
INSERT INTO users (id, email, password_hash, role, name, department_or_company) VALUES
('usr_gov_1', 'gov@demo.com', '$2a$10$4zG8D6YFj9E8X1sQ.00.0uG8h0s30mQ0W7rL9Z0m5k8r2y7A1B2C', 'Government Officer', 'Rajesh Sharma', 'Municipal Water Department, Pune'),
('usr_startup_1', 'startup@demo.com', '$2a$10$4zG8D6YFj9E8X1sQ.00.0uG8h0s30mQ0W7rL9Z0m5k8r2y7A1B2C', 'Startup', 'Priya Nair', 'AquaSense AI'),
('usr_eval_1', 'evaluator@demo.com', '$2a$10$4zG8D6YFj9E8X1sQ.00.0uG8h0s30mQ0W7rL9Z0m5k8r2y7A1B2C', 'Evaluator', 'Dr. Aris Mehta', 'National Innovation Assessment Board'),
('usr_admin_1', 'admin@demo.com', '$2a$10$4zG8D6YFj9E8X1sQ.00.0uG8h0s30mQ0W7rL9Z0m5k8r2y7A1B2C', 'Admin', 'GovInnovate Admin', 'Ministry of Urban Development');

-- Primary Challenge (The Demo Story)
INSERT INTO challenges (id, title, problem_statement, desired_outcome, department, category, location, budget, pilot_duration, tech_requirements, infra_requirements, kpis, status, created_by) VALUES
('chl_water_pune', 'AI-based water leakage detection for municipal pipelines', 'Municipal distribution pipelines suffer from undetectable micro-leaks leading to non-revenue water loss exceeding 35% across urban wards.', 'Early autonomous pinpointing of pipe leakages within 24 hours of inception with 90%+ accuracy.', 'Municipal Water Department', 'Water & Sanitation', 'Pune', '₹20 Lakhs', '3 Months', 'Acoustic sensing, IoT pressure telemetry, Machine Learning leakage detection model', 'Compatibility with existing SCADA pipeline flow telemetry', 'Leakage Accuracy > 90%, Cost Reduction > 15%, Pipeline Reliability > 95%, Ward User Satisfaction > 85%', 'Published', 'usr_gov_1'),
('chl_traffic_bengaluru', 'Adaptive Traffic Signal Control using Edge Computer Vision', 'Severe traffic congestion at major intersections during peak hours in IT corridor.', 'Dynamic real-time signal timing adjustments to reduce queue lengths by 25%.', 'Traffic Police Department', 'Smart Mobility', 'Bengaluru', '₹35 Lakhs', '6 Months', 'Edge AI camera processing, Dynamic signal relay protocol', 'Power pole mounts and optical fiber connectivity', 'Congestion reduction > 20%, Response time < 500ms', 'Published', 'usr_gov_1'),
('chl_waste_indore', 'Smart Municipal Solid Waste Bin Monitoring', 'Overfilled waste bins causing health hazards and inefficient collection vehicle routes.', 'Automated fill-level alerting and route optimization for collection trucks.', 'Indore Municipal Corporation', 'Waste Management', 'Indore', '₹15 Lakhs', '3 Months', 'Ultrasonic fill sensor, LoRaWAN mesh network, Route optimization AI', 'Solar powered sensors on standard plastic/metal bins', 'Collection efficiency +30%, Route distance -20%', 'Published', 'usr_gov_1'),
('chl_air_delhi', 'Hyperlocal Air Quality Index Forecasting System', 'Lack of ward-level real-time AQI forecasting for sensitive public health advisories.', 'Predictive 24-hour PM2.5 and PM10 heatmaps at 500m grid resolution.', 'Delhi Pollution Control Committee', 'Environment & Climate', 'Delhi', '₹50 Lakhs', '6 Months', 'Satellite imagery assimilation, Spatiotemporal GNN models', 'Integration with existing CPCB monitoring stations', 'Prediction MAE < 8%, Map update latency < 15 mins', 'Published', 'usr_gov_1'),
('chl_health_rural', 'AI Portable Diagnostic Kit for Primary Health Centres', 'Rural health centers lack lab technicians for fast CBC and blood chemistry analysis.', 'Point-of-care rapid testing within 10 minutes with cloud health record synchronization.', 'State Health Mission', 'Public Health', 'Jaipur', '₹25 Lakhs', '4 Months', 'Optical spectroscopy, Microfluidics, Cloud EHR API', 'Battery powered (min 12 hour continuous battery)', 'Diagnostic accuracy > 95%, Patient wait time < 15 mins', 'Published', 'usr_gov_1'),
('chl_solar_rooftop', 'Automated Rooftop Solar Potential Mapping via Satellite', 'Slow manual site surveys delaying residential solar subsidy approvals.', 'High-precision rooftop segment extraction and solar generation potential report in seconds.', 'Renewable Energy Agency', 'Clean Energy', 'Ahmedabad', '₹18 Lakhs', '3 Months', 'High-res satellite segmentation models, GIS building geometry processing', 'Cloud API access', 'Roof area estimation error < 5%, Processing speed < 3 sec per roof', 'Draft', 'usr_gov_1'),
('chl_pothole_mumbai', 'Automated Pothole Mapping & Maintenance Dispatch', 'Delayed detection and repair of monsoon potholes causing road accidents.', 'Mobile app / dashcam AI detection of potholes with auto-geotagged municipal work orders.', 'Brihanmumbai Municipal Corporation', 'Urban Infrastructure', 'Mumbai', '₹30 Lakhs', '4 Months', 'Mobile Computer Vision, Geotagging, Work order ERP connector', 'Mountable smartphone / dashcam rig', 'Pothole detection recall > 92%, Repair cycle time -40%', 'Published', 'usr_gov_1'),
('chl_grid_theft', 'Discom Electricity Loss & Power Theft Anomaly Detection', 'Unaccounted distribution line losses in rural feeder segments due to unauthorized tapping.', 'Feeder-level meter telemetry anomaly detection pinpointing theft locations.', 'State Power Distribution Corp', 'Energy & Power', 'Lucknow', '₹40 Lakhs', '6 Months', 'Smart meter time-series analysis, XGBoost anomaly detection', 'Feeder transformer smart meter connectivity', 'Theft detection precision > 88%, Non-technical loss reduction 20%', 'Published', 'usr_gov_1'),
('chl_agri_pest', 'Early Crop Pest & Disease Alerting System for Farmers', 'Outbreaks of pink bollworm causing severe yield losses to cotton farmers.', 'Mobile app image analysis giving instant treatment recommendations in regional language.', 'Department of Agriculture', 'Agritech', 'Nagpur', '₹22 Lakhs', '4 Months', 'CNN image classification, Offline inference engine, Multilingual NLP', 'Runs on low-cost Android smartphones without internet', 'Identification accuracy > 90%, Farmer satisfaction > 90%', 'Published', 'usr_gov_1'),
('chl_cyber_gov', 'Zero-Trust Audit & Anomaly Detection for District Portals', 'Unnoticed unauthorized access attempts on public welfare application portals.', 'Real-time user behavior analytics and anomaly detection blocking suspicious transactions.', 'National Informatics Centre', 'Cybersecurity', 'Hyderabad', '₹45 Lakhs', '6 Months', 'User Entity Behavior Analytics (UEBA), Zero-trust token middleware', 'Integrates with Linux application server syslog', 'False positive rate < 0.1%, Detection time < 1s', 'Published', 'usr_gov_1');

-- Startups & Solutions
INSERT INTO startups (id, company_name, solution_name, description, technology, sector, geography, readiness, infra_reqs, cost_band, previous_pilots, user_id) VALUES
('stp_aquasense', 'AquaSense AI', 'HydroPulse AI Leak Detector', 'Acoustic AI sensor network with edge processing for pinpointing micro-leaks in municipal water distribution mains.', 'Acoustic Sensors, Edge AI, IoT Telemetry, Python ML Engine', 'Water & Sanitation', 'Pune, Maharashtra', 'Pilot Ready (TRL 8)', 'SCADA Gateway Integration, Standard Flange Mounting', '₹15L - ₹20L', 'Completed 2 successful municipal trials in Nashik & Surat (94% leak accuracy)', 'usr_startup_1'),
('stp_waterguard', 'WaterGuard Tech', 'FlowGuard SCADA Analytics', 'Cloud-based pressure wave analysis for bulk water transport pipelines.', 'Pressure Transducers, Cloud Time-series ML', 'Water & Sanitation', 'Mumbai, Maharashtra', 'Early Stage (TRL 6)', 'Requires high frequency pressure sensor installation', '₹20L - ₹25L', '1 University campus trial', 'usr_startup_1'),
('stp_pipevision', 'PipeVision Robotics', 'PipeCrawler Robot AI', 'Autonomous robotic crawler for internal camera pipe inspection.', 'Robotics, Computer Vision, Ultrasonic Testing', 'Water & Sanitation', 'Bengaluru, Karnataka', 'Commercial Ready (TRL 9)', 'Manual pipe access points', '₹30L - ₹40L', 'Industrial plant pipeline inspection', 'usr_startup_1'),
('stp_traffix', 'Traffix AI Solutions', 'SmartCross Junction Controller', 'Edge-based computer vision traffic light optimizer.', 'NVIDIA Jetson, PyTorch, Real-time Relay Protocol', 'Smart Mobility', 'Bengaluru, Karnataka', 'Pilot Ready (TRL 8)', 'Traffic light cabinet access', '₹25L - ₹35L', 'Tested at 3 intersections in Mysuru', 'usr_startup_1'),
('stp_cleanbin', 'CleanBin IoT', 'WasteSense LoRa Monitor', 'Ultrasonic bin level sensor with dynamic truck routing application.', 'Ultrasonic Sensors, LoRaWAN, Genetic Route Optimizer', 'Waste Management', 'Indore, Madhya Pradesh', 'Commercial Ready (TRL 9)', 'LoRaWAN gateway placement', '₹10L - ₹15L', 'Deployed across 200 commercial bins in Indore', 'usr_startup_1'),
('stp_airview', 'AirView Environmental', 'AeroPulse Spatiotemporal AQI', 'High-resolution hyperlocal air pollution forecasting platform.', 'GIS, Graph Neural Networks, Satellite Data Fusion', 'Environment & Climate', 'New Delhi', 'Pilot Ready (TRL 7)', 'Cloud server API endpoint', '₹40L - ₹50L', 'Pilot with Delhi IIT research park', 'usr_startup_1'),
('stp_diagno', 'DiagnoPoint Medical', 'HealthKit Portable Lab', 'Battery operated microfluidic diagnostic analyzer for 25 blood parameters.', 'Microfluidics, Spectrophotometry, Bluetooth CloudSync', 'Public Health', 'Jaipur, Rajasthan', 'Pilot Ready (TRL 8)', '12V DC / Battery power', '₹20L - ₹25L', 'Tested at 5 Rajasthan PHCs', 'usr_startup_1'),
('stp_solarmap', 'SolarMap GIS', 'RoofSolar AI Mapper', 'Automated satellite roof vectorization and solar irradiance modeling.', 'DeepLabV3+, GIS GDAL, AWS Cloud', 'Clean Energy', 'Ahmedabad, Gujarat', 'Commercial Ready (TRL 9)', 'API Webhook', '₹15L - ₹18L', 'Mapped 50,000 roofs in Surat', 'usr_startup_1'),
('stp_roadpatrol', 'RoadPatrol Vision', 'PotholeFix Auto-Tag', 'Vehicle mounted mobile vision AI for road defect cataloging.', 'TensorFlow Lite, Mobile Dashcam, GPS', 'Urban Infrastructure', 'Mumbai, Maharashtra', 'Pilot Ready (TRL 8)', 'Smartphone vehicle mount', '₹20L - ₹30L', 'Tested with Mumbai bus routes', 'usr_startup_1'),
('stp_gridshield', 'GridShield Energy', 'FeederGuard Loss Detector', 'Transformer-level telemetry anomaly detection software.', 'XGBoost, Smart Meter MQTT Telemetry', 'Energy & Power', 'Lucknow, Uttar Pradesh', 'Pilot Ready (TRL 7)', 'Smart meter data feed', '₹30L - ₹40L', 'Feeder audit pilot in Kanpur', 'usr_startup_1');

-- Solutions link
INSERT INTO solutions (id, startup_id, solution_name, summary, tech_stack) VALUES
('sol_aquasense', 'stp_aquasense', 'HydroPulse AI Leak Detector', 'Real-time acoustic telemetry and AI anomaly detection for water distribution pipelines.', 'Python, PyTorch, LoRaWAN, PostgreSQL'),
('sol_waterguard', 'stp_waterguard', 'FlowGuard SCADA Analytics', 'High-speed pressure transient analysis identifying hydraulic loss points.', 'Node.js, Python, InfluxDB'),
('sol_pipevision', 'stp_pipevision', 'PipeCrawler Robot AI', 'Robotic internal pipe inspection identifying structural fractures and root penetrations.', 'C++, Python OpenCV, ROS2');

-- Seeded Matches for Primary Challenge
INSERT INTO matches (id, challenge_id, startup_id, overall_score, component_scores_json, reasons_json, gaps_json, confidence, shortlisted) VALUES
('mtc_aqua_1', 'chl_water_pune', 'stp_aquasense', 94, 
 '{"domain": 30, "technology": 20, "readiness": 15, "cost": 10, "geography": 10, "evidence": 9, "infra": 0}',
 '["Strong municipal water management experience in Maharashtra", "Required acoustic IoT AI technology readily available", "High pilot deployment readiness (TRL 8)", "Previous proven municipal pilot evidence in Nashik & Surat"]',
 '["Infrastructure SCADA compatibility requires initial verification during deployment setup"]',
 'High', TRUE),
('mtc_waterguard_1', 'chl_water_pune', 'stp_waterguard', 87,
 '{"domain": 28, "technology": 18, "readiness": 12, "cost": 9, "geography": 10, "evidence": 5, "infra": 5}',
 '["Strong domain focus on water pipelines", "Proven pressure transducer telemetry", "Local team in Mumbai"]',
 '["Lower readiness level (TRL 6)", "Limited municipal trial evidence"]',
 'Medium', FALSE),
('mtc_pipevision_1', 'chl_water_pune', 'stp_pipevision', 79,
 '{"domain": 25, "technology": 19, "readiness": 15, "cost": 5, "geography": 7, "evidence": 5, "infra": 3}',
 '["Excellent internal structural pipe inspection technology", "Commercial TRL 9 readiness"]',
 '["Cost band higher than budget", "Robotic crawler requires shutting down water mains during inspection"]',
 'Medium', FALSE);

-- Demo Pilot (The Primary Story)
INSERT INTO pilots (id, name, challenge_id, startup_id, location, start_date, end_date, overall_score, recommendation, status) VALUES
('plt_pune_water', 'Pune Municipal Water Network Pilot', 'chl_water_pune', 'stp_aquasense', 'Ward 4 & 7, Pune Municipal Corp', '2026-03-01', '2026-06-01', 89, 'SCALE REVIEW RECOMMENDED', 'Evaluated');

-- KPI Results for Demo Pilot
INSERT INTO kpis (id, pilot_id, name, target, actual, unit, score, status) VALUES
('kpi_1', 'plt_pune_water', 'Leakage Detection Accuracy', '> 90%', '92%', 'Percentage', 92, 'Target Achieved'),
('kpi_2', 'plt_pune_water', 'Non-Revenue Water Cost Reduction', '> 15%', '18%', 'Percentage', 90, 'Target Exceeded'),
('kpi_3', 'plt_pune_water', 'Pipeline Telemetry Reliability', '> 95%', '96%', 'Percentage', 96, 'Target Achieved'),
('kpi_4', 'plt_pune_water', 'Municipal Ward User Satisfaction', '> 85%', '87%', 'Score', 87, 'Target Achieved');

-- Evidence Items
INSERT INTO evidence (id, pilot_id, claim, source, type, status, verified_by, verified_at) VALUES
('ev_1', 'plt_pune_water', 'Achieved 92% accurate leakage localization across 15km pipeline segment in Ward 4 within 18 hours of leak occurrence.', 'PMC Water Engineering Telemetry Logs & Ground Repair Verification', 'Field Audit', 'Verified', 'usr_eval_1', CURRENT_TIMESTAMP),
('ev_2', 'plt_pune_water', 'Prevented an estimated 1.2 million liters of water loss during 90-day pilot trial.', 'Flow Meter SCADA Telemetry Analysis', 'SCADA Logs', 'Verified', 'usr_eval_1', CURRENT_TIMESTAMP),
('ev_3', 'plt_pune_water', 'Zero false positive emergency dig work orders generated during pilot evaluation.', 'PMC Works Department Logbook', 'Municipal Audit', 'Verified', 'usr_eval_1', CURRENT_TIMESTAMP);

-- Evidence Passport
INSERT INTO evidence_passports (id, pilot_id, passport_number, data_json, status) VALUES
('pass_pune_water', 'plt_pune_water', 'INNO-PASS-2026-PUNE-WATER-001',
 '{"passport_number": "INNO-PASS-2026-PUNE-WATER-001", "challenge_title": "AI-based water leakage detection for municipal pipelines", "department": "Municipal Water Department, Pune", "startup": "AquaSense AI", "solution": "HydroPulse AI Leak Detector", "pilot_name": "Pune Municipal Water Network Pilot", "location": "Ward 4 & 7, Pune Municipal Corp", "duration": "3 Months (Mar 2026 - Jun 2026)", "overall_score": 89, "recommendation": "SCALE REVIEW RECOMMENDED", "evaluator": "Dr. Aris Mehta (National Innovation Assessment Board)", "verification_date": "2026-06-05", "kpis": [{"name": "Leakage Detection Accuracy", "target": "> 90%", "actual": "92%", "status": "Achieved"}, {"name": "Non-Revenue Water Cost Reduction", "target": "> 15%", "actual": "18%", "status": "Exceeded"}, {"name": "Pipeline Telemetry Reliability", "target": "> 95%", "actual": "96%", "status": "Achieved"}, {"name": "Municipal Ward User Satisfaction", "target": "> 85%", "actual": "87%", "status": "Achieved"}], "evidence_count": 3, "disclaimer": "Platform-generated Evidence Passport based on verified pilot telemetry. Not formal government procurement certification."}',
 'Verified');

-- Procurement Status
INSERT INTO procurement (id, pilot_id, status, notes, updated_by) VALUES
('prc_pune_water', 'plt_pune_water', 'Procurement Review', 'Pilot evidence verified. Recommended for scale evaluation across 5 additional Pune municipal wards under Smart City Innovation fund.', 'usr_gov_1');

-- Audit Logs
INSERT INTO audit_logs (id, actor, action, resource, timestamp) VALUES
('aud_1', 'Rajesh Sharma (Government Officer)', 'Challenge Created', 'AI-based water leakage detection for municipal pipelines', CURRENT_TIMESTAMP),
('aud_2', 'Rajesh Sharma (Government Officer)', 'Challenge Published', 'AI-based water leakage detection for municipal pipelines', CURRENT_TIMESTAMP),
('aud_3', 'Rajesh Sharma (Government Officer)', 'AI Match Run', 'Match calculation completed (AquaSense AI - 94%)', CURRENT_TIMESTAMP),
('aud_4', 'Rajesh Sharma (Government Officer)', 'Startup Shortlisted', 'AquaSense AI shortlisted for Pune Water Challenge', CURRENT_TIMESTAMP),
('aud_5', 'Rajesh Sharma (Government Officer)', 'Pilot Created', 'Pune Municipal Water Network Pilot', CURRENT_TIMESTAMP),
('aud_6', 'Priya Nair (Startup)', 'Evidence Submitted', 'Field Audit & SCADA Logs submitted for verification', CURRENT_TIMESTAMP),
('aud_7', 'Dr. Aris Mehta (Evaluator)', 'Evidence Verified', '3 Evidence items verified for Pune Water Pilot', CURRENT_TIMESTAMP),
('aud_8', 'Dr. Aris Mehta (Evaluator)', 'Pilot Evaluated', 'Overall Score: 89/100 -> SCALE REVIEW RECOMMENDED', CURRENT_TIMESTAMP),
('aud_9', 'System', 'Evidence Passport Generated', 'INNO-PASS-2026-PUNE-WATER-001', CURRENT_TIMESTAMP),
('aud_10', 'Rajesh Sharma (Government Officer)', 'Procurement Status Updated', 'Updated status to Procurement Review', CURRENT_TIMESTAMP);
