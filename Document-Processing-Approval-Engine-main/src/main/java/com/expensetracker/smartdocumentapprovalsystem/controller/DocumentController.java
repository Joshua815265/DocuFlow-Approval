package com.expensetracker.smartdocumentapprovalsystem.controller;

import com.expensetracker.smartdocumentapprovalsystem.dto.DocumentResponseDTO;
import com.expensetracker.smartdocumentapprovalsystem.dto.Status;
import com.expensetracker.smartdocumentapprovalsystem.dto.UserDto;
import com.expensetracker.smartdocumentapprovalsystem.model.Document;
import com.expensetracker.smartdocumentapprovalsystem.model.WorkFlow;
import com.expensetracker.smartdocumentapprovalsystem.service.DocumentService;
import com.expensetracker.smartdocumentapprovalsystem.service.UserService;
import com.expensetracker.smartdocumentapprovalsystem.service.WorkFlowService;
import com.expensetracker.smartdocumentapprovalsystem.utils.FileStorageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private UserService userService;

    @Autowired
    private WorkFlowService workFlowService;

    @Autowired
    private FileStorageUtil fileStorageUtil;

    // Upload Document
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            Principal principal
    ) {
        try {
            // Get current user
            UserDto uploadedBy = userService.getUserByEmail(principal.getName());

            // Save document
            Document savedDocument = documentService.createDocument(file, title, uploadedBy.getId());

            return ResponseEntity.ok(savedDocument);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error uploading document: " + e.getMessage());
        }
    }

    // Get all documents uploaded by user
    @GetMapping("/my")
    public ResponseEntity<List<DocumentResponseDTO>> getMyDocuments(Principal principal) {
        UserDto user = userService.getUserByEmail(principal.getName());
        List<Document> documents = documentService.getDocumentsByUser((long) user.getId());

        List<DocumentResponseDTO> documentDTOs = documents.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(documentDTOs);
    }

    // Get all documents (admin or manager)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('OFFICER')")
    public ResponseEntity<List<DocumentResponseDTO>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();

        List<DocumentResponseDTO> documentDTOs = documents.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(documentDTOs);
    }

    // Get document by ID
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }



    // Download document
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id, Principal principal) {
        try {
            // Get document details
            Document document = documentService.getDocumentById(id);

            // Security check: Only allow download if user is uploader or has review permissions
            UserDto currentUser = userService.getUserByEmail(principal.getName());
            boolean canDownload = document.getUploadedBy().getId() == currentUser.getId() ||
                                currentUser.getRole().name().equals("ADMIN") ||
                                currentUser.getRole().name().equals("MANAGER") ||
                                currentUser.getRole().name().equals("OFFICER");

            if (!canDownload) {
                return ResponseEntity.status(403).build();
            }

            // Load file as Resource
            Path filePath = fileStorageUtil.loadFileAsResource(document.getUploadPath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = "application/octet-stream";
                if (document.getTitle().toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                               "attachment; filename=\"" + document.getTitle() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete document (only by owner)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Principal principal) {
        try {
            UserDto user = userService.getUserByEmail(principal.getName());
            Document document = documentService.getDocumentById(id);

            // Check if user is the owner of the document
            if (document.getUploadedBy().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Check if document is still pending (can only delete pending documents)
            if (document.getStatus() != Status.PENDING) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            documentService.deleteDocument(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    private DocumentResponseDTO convertToDTO(Document doc) {
        // Get workflows for this document to calculate progress
        List<WorkFlow> workflows = workFlowService.getWorkflowByDocumentId(doc.getId());

        int totalWorkflows = 3; // Officer, Manager, Admin
        int completedWorkflows = (int) workflows.stream()
            .filter(wf -> wf.getStatus() == Status.APPROVED || wf.getStatus() == Status.REJECTED)
            .count();

        int progressPercentage;
        if (doc.getStatus() == Status.APPROVED) {
            progressPercentage = 100;
        } else if (doc.getStatus() == Status.REJECTED) {
            progressPercentage = 100;
        } else {
            // Calculate based on completed workflows
            progressPercentage = (completedWorkflows * 100) / totalWorkflows;
            if (progressPercentage == 0 && doc.getStatus() == Status.PENDING) {
                progressPercentage = 33; // At least show some progress for pending
            }
        }

        return new DocumentResponseDTO(
            doc.getId(),
            doc.getTitle(),
            doc.getStatus(),
            doc.getCreatedAt(),
            doc.getReviewedAt(),
            doc.getComment(),
            doc.getUploadPath(),
            doc.getUploadedBy() != null ? doc.getUploadedBy().getName() : "Unknown",
            progressPercentage,
            completedWorkflows,
            totalWorkflows
        );
    }
}
