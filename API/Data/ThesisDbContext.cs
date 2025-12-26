using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JobberAPI.Models;

public partial class ThesisDbContext : DbContext
{
    public ThesisDbContext()
    {
    }

    public ThesisDbContext(DbContextOptions<ThesisDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CandidateEducation> CandidateEducations { get; set; }

    public virtual DbSet<CandidateLanguge> CandidateLanguges { get; set; }

    public virtual DbSet<CandidateSkill> CandidateSkills { get; set; }

    public virtual DbSet<EducationField> EducationFields { get; set; }

    public virtual DbSet<EducationLevel> EducationLevels { get; set; }

    public virtual DbSet<Interview> Interviews { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<JobEducation> JobEducations { get; set; }

    public virtual DbSet<JobLanguage> JobLanguages { get; set; }

    public virtual DbSet<JobSkill> JobSkills { get; set; }

    public virtual DbSet<Language> Languages { get; set; }

    public virtual DbSet<LanguageLevel> LanguageLevels { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<RecommendedSkill> RecommendedSkills { get; set; }

    public virtual DbSet<SkillComboFrequency> SkillComboFrequencies { get; set; }

    public virtual DbSet<User> Users { get; set; }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //     => optionsBuilder.UseSqlServer("Server=DESKTOP-E203CLP\\SQLEXPRESS;Database=Thesis;Trusted_Connection=true;Integrated Security=true;TrustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CandidateEducation>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.EducationLevelId, e.FieldId });

            entity.ToTable("CandidateEducation");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();

            entity.HasOne(d => d.EducationLevel).WithMany(p => p.CandidateEducations)
                .HasForeignKey(d => d.EducationLevelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandEd_EduLevel");

            entity.HasOne(d => d.Field).WithMany(p => p.CandidateEducations)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandEd_Field");

            entity.HasOne(d => d.User).WithMany(p => p.CandidateEducations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandEd_User");
        });

        modelBuilder.Entity<CandidateLanguge>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Candidat__3214EC0729C6A0A5");

            entity.ToTable("CandidateLanguge");

            entity.HasIndex(e => new { e.UserId, e.LanguageCode, e.LanguageLevelCode }, "UQ_CandidateLanguage").IsUnique();

            entity.Property(e => e.LanguageCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.LanguageLevelCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.CandidateLanguges)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandLang_Lang");

            entity.HasOne(d => d.LanguageLevelCodeNavigation).WithMany(p => p.CandidateLanguges)
                .HasForeignKey(d => d.LanguageLevelCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandLang_LangLev");

            entity.HasOne(d => d.User).WithMany(p => p.CandidateLanguges)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandLang_User");
        });

        modelBuilder.Entity<CandidateSkill>(entity =>
        {
            entity.HasKey(e => new { e.Id, e.UserId, e.SkillId });

            entity.ToTable("CandidateSkill");

            entity.HasIndex(e => new { e.UserId, e.SkillId }, "UQ_CandidateSkill").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedOnAdd();

            entity.HasOne(d => d.Skill).WithMany(p => p.CandidateSkills)
                .HasForeignKey(d => d.SkillId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CandSk_Skill");

            entity.HasOne(d => d.User).WithMany(p => p.CandidateSkills)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cand_User");
        });

        modelBuilder.Entity<EducationField>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Educatio__3214EC077E8A9F1C");

            entity.ToTable("EducationField");

            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EducationLevel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Educatio__3214EC0765AAB79F");

            entity.ToTable("EducationLevel");

            entity.Property(e => e.Level)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Interview>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Intervie__3214EC07CAACF285");

            entity.ToTable("Interview");

            entity.Property(e => e.HasAccepted)
                .IsRequired()
                .HasDefaultValueSql("('false')")
                .HasColumnName("Has_accepted");

            entity.HasOne(d => d.Cand).WithMany(p => p.InterviewCands)
                .HasForeignKey(d => d.CandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Candi_User");

            entity.HasOne(d => d.Emplo).WithMany(p => p.InterviewEmplos)
                .HasForeignKey(d => d.EmploId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Emplo_User");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Job__3214EC0702B44DB0");

            entity.ToTable("Job");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.Title).HasMaxLength(255);

            entity.HasOne(d => d.User).WithMany(p => p.Jobs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JOB_USER");
        });

        modelBuilder.Entity<JobEducation>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__JobEduca__3214EC0741B6433F");

            entity.ToTable("JobEducation");

            entity.HasOne(d => d.EducationLevel).WithMany(p => p.JobEducations)
                .HasForeignKey(d => d.EducationLevelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobEdu_Level");

            entity.HasOne(d => d.Field).WithMany(p => p.JobEducations)
                .HasForeignKey(d => d.FieldId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobEdu_Field");

            entity.HasOne(d => d.Job).WithMany(p => p.JobEducations)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobEdu_Job");
        });

        modelBuilder.Entity<JobLanguage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__JobLangu__3214EC074EB59050");

            entity.ToTable("JobLanguage");

            entity.Property(e => e.LanguageCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.LanguageLevelCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.Job).WithMany(p => p.JobLanguages)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobLang_Job");

            entity.HasOne(d => d.LanguageCodeNavigation).WithMany(p => p.JobLanguages)
                .HasForeignKey(d => d.LanguageCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobEdu_Lang");

            entity.HasOne(d => d.LanguageLevelCodeNavigation).WithMany(p => p.JobLanguages)
                .HasForeignKey(d => d.LanguageLevelCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobEdu_LangLevel");
        });

        modelBuilder.Entity<JobSkill>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__JobSkill__3214EC07611F63C7");

            entity.ToTable("JobSkill");

            entity.HasOne(d => d.Job).WithMany(p => p.JobSkills)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobSkill_Job");

            entity.HasOne(d => d.Skill).WithMany(p => p.JobSkills)
                .HasForeignKey(d => d.SkillId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JobSkill_Skill");
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__Language__A25C5AA6A9273084");

            entity.ToTable("Language");

            entity.Property(e => e.Code)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<LanguageLevel>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__Language__A25C5AA6011CF8F5");

            entity.ToTable("LanguageLevel");

            entity.Property(e => e.Code)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Level).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__Role__A25C5AA6D616DA74");

            entity.ToTable("Role");

            entity.Property(e => e.Code)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.ToTable("Skill");

            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SkillComboFrequency>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("SkillComboFrequency");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__User__3214EC078D7E60C8");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "UQ_USER_EMAIL").IsUnique();

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RoleCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Telephone)
                .HasMaxLength(12)
                .IsUnicode(false);

            entity.HasOne(d => d.RoleCodeNavigation).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_USER_ROLE");
        });

        modelBuilder.Entity<RecommendedSkill>().HasNoKey().ToView(null);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
