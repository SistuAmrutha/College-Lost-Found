package com.collegelostfound.config;

import com.collegelostfound.model.*;
import com.collegelostfound.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ClaimRepository claimRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(UserRepository userRepository,
                      ItemRepository itemRepository,
                      ClaimRepository claimRepository,
                      ConversationRepository conversationRepository,
                      MessageRepository messageRepository,
                      NotificationRepository notificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.claimRepository = claimRepository;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) {
            logger.info("Database seeding is disabled (app.seed.enabled=false).");
            return;
        }

        if (userRepository.count() > 0) {
            logger.info("Database already contains data (users count: {}). Skipping seeder.", userRepository.count());
            return;
        }

        logger.info("Seeding initial development test users and realistic listings...");

        // 1. Seed Administrator
        User admin = new User(
                "Campus Admin",
                "admin@college.edu",
                "ADM2026",
                "Administration",
                "Staff",
                "+1-555-0100",
                passwordEncoder.encode("Admin@123"),
                Role.ROLE_ADMIN
        );
        admin = userRepository.save(admin);

        // 2. Seed Students
        User student1 = new User(
                "Alex Rivera",
                "alex.rivera@college.edu",
                "CS202301",
                "Computer Science & Engineering",
                "3rd Year",
                "+1-555-0101",
                passwordEncoder.encode("Password@123"),
                Role.ROLE_STUDENT
        );
        student1 = userRepository.save(student1);

        User student2 = new User(
                "Priya Sharma",
                "priya.sharma@college.edu",
                "ECE202245",
                "Electronics & Communication",
                "4th Year",
                "+1-555-0102",
                passwordEncoder.encode("Password@123"),
                Role.ROLE_STUDENT
        );
        student2 = userRepository.save(student2);

        User student3 = new User(
                "Marcus Chen",
                "marcus.chen@college.edu",
                "ME202412",
                "Mechanical Engineering",
                "2nd Year",
                "+1-555-0103",
                passwordEncoder.encode("Password@123"),
                Role.ROLE_STUDENT
        );
        student3 = userRepository.save(student3);

        // 3. Seed 15 Realistic Lost & Found Listings
        List<Item> items = new ArrayList<>();

        items.add(createItem("Black Leather Wallet",
                "Lost a dark brown/black bifold leather wallet containing college student ID card and bus pass.",
                ItemType.LOST, "Wallets and Money", "Library", "2026-10-10", "11:30 AM",
                "Embossed corner initials, Tommy Hilfiger logo inside", "Reward offered if returned intact.",
                student1.getId(), student1.getFullName(), ItemStatus.CLAIM_PENDING));

        items.add(createItem("Hydro Flask Blue Water Bottle",
                "Found a stainless steel matte blue water bottle with stickers on the reading table.",
                ItemType.FOUND, "Water Bottles", "Library", "2026-10-10", "01:00 PM",
                "Has a sticker of GitHub Octocat and an Astronomy club logo", "Safely kept with library front desk assistant.",
                student2.getId(), student2.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Scientific Calculator Casio fx-991EX",
                "Left my calculator in the examination hall or CSE Block Room 302 after midterms.",
                ItemType.LOST, "Electronics", "CSE Block", "2026-10-09", "03:45 PM",
                "Black case with small scratch near solar cell", "Needed urgently for practical exams next week.",
                student3.getId(), student3.getFullName(), ItemStatus.OPEN));

        items.add(createItem("North Face Black Backpack",
                "Found a black North Face backpack near table 6 in the main cafeteria during lunch hour.",
                ItemType.FOUND, "Bags", "Cafeteria", "2026-10-11", "01:30 PM",
                "Contains spiral notebooks and a pencil pouch", "Please specify notebook subject names to verify.",
                student1.getId(), student1.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Engineering Mathematics Notebook",
                "Lost blue-cover spiral bound notebook containing complete semester notes.",
                ItemType.LOST, "Books and Stationery", "Classroom", "2026-10-08", "04:15 PM",
                "Has 'Engg Maths III - Marcus' written on first page", "Very important for upcoming internals.",
                student3.getId(), student3.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Black Folding Umbrella",
                "Found a compact automatic black umbrella under bench in bus stop near sports ground.",
                ItemType.FOUND, "Other", "Sports Ground", "2026-10-10", "05:00 PM",
                "Wooden handle with push button", "Found after the evening drizzle.",
                student2.getId(), student2.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Set of 3 Keys with Red Lanyard",
                "Lost set of hostel room and bike keys on a bright red college lanyard.",
                ItemType.LOST, "Keys", "Hostel", "2026-10-09", "08:30 PM",
                "Two silver Yale keys and one brass bike key", "Lost somewhere between Hostel Block B and mess.",
                student1.getId(), student1.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Apple AirPods Pro 2nd Gen Case",
                "Found white AirPods case with silicone green protective sleeve in computer lab 4.",
                ItemType.FOUND, "Electronics", "Computer Lab", "2026-10-11", "10:15 AM",
                "Green silicone sleeve, lightning port", "Owner must demonstrate Bluetooth pairing connection to claim.",
                student2.getId(), student2.getFullName(), ItemStatus.OPEN));

        items.add(createItem("65W USB-C Laptop Charger",
                "Lost my black Lenovo ThinkPad 65W charging brick in seminar hall during tech symposium.",
                ItemType.LOST, "Electronics", "Auditorium", "2026-10-07", "02:00 PM",
                "Wrapped with velcro tie, slight fray on cable end", "Greatly appreciated if found.",
                student3.getId(), student3.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Fastrack Analog Wristwatch",
                "Found black dial sports watch left behind in the sports changing rooms.",
                ItemType.FOUND, "Accessories", "Sports Ground", "2026-10-10", "06:30 PM",
                "Silicone black strap, silver buckle", "Contact me or verify the time it was set to.",
                student1.getId(), student1.getFullName(), ItemStatus.RETURNED));

        items.add(createItem("Data Structures and Algorithms Textbook",
                "Forgot Cormen (CLRS) 3rd edition hardback book on bench near parking lot.",
                ItemType.LOST, "Books and Stationery", "Parking Area", "2026-10-08", "12:00 PM",
                "Has yellow sticky notes on Dynamic Programming chapter", "Library copy, due soon!",
                student2.getId(), student2.getFullName(), ItemStatus.OPEN));

        items.add(createItem("SanDisk 64GB USB 3.0 Flash Drive",
                "Found red and black metal slide USB drive plugged into terminal 18.",
                ItemType.FOUND, "Electronics", "Computer Lab", "2026-10-11", "04:30 PM",
                "SanDisk Ultra Flair 64GB", "Contains project folders. Can verify owner by folder titles.",
                student3.getId(), student3.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Ray-Ban Prescription Glasses in Brown Case",
                "Lost black rim spectacles inside hard brown case on morning college bus route 7.",
                ItemType.LOST, "Accessories", "College Bus", "2026-10-11", "08:45 AM",
                "Matte black frame with subtle gold accent", "Crucial for attending lectures.",
                student1.getId(), student1.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Navy Blue Denim Jacket (Size M)",
                "Found denim jacket draped over auditorium back row chair after orientation.",
                ItemType.FOUND, "Clothing", "Auditorium", "2026-10-06", "05:15 PM",
                "Has metallic buttons and small pin badge on collar", "Stored with department coordinator.",
                student2.getId(), student2.getFullName(), ItemStatus.OPEN));

        items.add(createItem("Student Identity Card (ECE Dept)",
                "Found plastic smart ID card on the pathway between Admin building and CSE block.",
                ItemType.FOUND, "Identity Documents", "CSE Block", "2026-10-12", "09:00 AM",
                "Cardholder surname starts with 'S'", "Handed over to Security Desk for private ID verification.",
                student3.getId(), student3.getFullName(), ItemStatus.OPEN));

        items = itemRepository.saveAll(items);

        // 4. Sample Claim on the First Item (Black Wallet)
        Item walletItem = items.get(0);
        Claim sampleClaim = new Claim(
                walletItem.getId(),
                walletItem.getTitle(),
                student2.getId(),
                student2.getFullName(),
                "Hello, I believe this is the wallet I spotted near the circulation desk yesterday morning.",
                "It has a state transit card and a silver RFID blocker card."
        );
        claimRepository.save(sampleClaim);

        // 5. Sample Notifications
        notificationRepository.save(new Notification(
                student1.getId(),
                NotificationType.CLAIM_SUBMITTED,
                "New Claim on Black Leather Wallet",
                "Priya Sharma submitted a recovery claim for your reported lost item.",
                sampleClaim.getId(),
                "CLAIM"
        ));

        notificationRepository.save(new Notification(
                student2.getId(),
                NotificationType.SYSTEM_ALERT,
                "Welcome to College Lost & Found",
                "Your student account is active. You can now post lost/found items and message classmates.",
                null,
                "SYSTEM"
        ));

        // 6. Sample Conversation & Messages
        Conversation conv = new Conversation();
        conv.setParticipantIds(List.of(student1.getId(), student2.getId()));
        Map<String, String> names = new HashMap<>();
        names.put(student1.getId(), student1.getFullName());
        names.put(student2.getId(), student2.getFullName());
        conv.setParticipantNames(names);
        conv.setRelatedItemId(walletItem.getId());
        conv.setRelatedItemTitle(walletItem.getTitle());
        conv.setLastMessage("I can meet you by the library entrance at 2 PM to verify!");
        conv.setLastMessageSenderId(student2.getId());
        conv.setLastMessageAt(Instant.now());
        conv = conversationRepository.save(conv);

        messageRepository.save(new Message(conv.getId(), student1.getId(), student1.getFullName(), "Hi Priya, thanks for the claim note. Does it have my transit pass inside?"));
        messageRepository.save(new Message(conv.getId(), student2.getId(), student2.getFullName(), "Yes! I saw the transit pass and handed it to the librarian for safekeeping."));
        messageRepository.save(new Message(conv.getId(), student2.getId(), student2.getFullName(), "I can meet you by the library entrance at 2 PM to verify!"));

        logger.info("Database successfully seeded with 4 users (1 admin, 3 students), 15 listings, 1 claim, notifications, and conversation history.");
    }

    private Item createItem(String title, String description, ItemType type, String category,
                            String location, String date, String time, String features, String notes,
                            String ownerId, String ownerName, ItemStatus status) {
        Item item = new Item(title, description, type, category, new ArrayList<>(), location, date, time, features, notes, ownerId, ownerName);
        item.setStatus(status);
        if (status == ItemStatus.RETURNED) {
            item.setReturnedAt(Instant.now().minusSeconds(86400));
        }
        return item;
    }
}
