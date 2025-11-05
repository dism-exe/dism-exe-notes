---
parent: '[[001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation]]'
spawned_by: '[[009 Impl Lexon types for whole thumb instructions]]'
context_type: entry
---

Parent: [001 Turn EWRAM and ROM Structs into C Structs and embed into type for gdb memory manipulation](../001%20Turn%20EWRAM%20and%20ROM%20Structs%20into%20C%20Structs%20and%20embed%20into%20type%20for%20gdb%20memory%20manipulation.md)

Spawned by: [009 Impl Lexon types for whole thumb instructions](../tasks/009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md)

Spawned in: [<a name="spawn-entry-2f8763" />^spawn-entry-2f8763](../tasks/009%20Impl%20Lexon%20types%20for%20whole%20thumb%20instructions.md#spawn-entry-2f8763)

# 1 Journal

2025-11-04 Wk 45 Tue - 07:47 +03:00

````python
rhd_rhs_regex = re.compile(r"^(r[0-9]|r1[0-2]|sp|lr|pc), *(r1[0-2]|r[0-9]|sp|lr|pc)(?!,)$")
rd_rs_regex = re.compile(r"^(r[0-7]), *(r[0-7])(?!,)$")
rd_rs_imm_regex = re.compile(r"^(r[0-7]), *(r[0-7]), *(#[^,]+)(?!,)$")
rd_rs_rn_regex = re.compile(r"^(r[0-7]), *(r[0-7]), *(r[0-7])$")
rd_imm_regex = re.compile(r"^(r[0-7]), *(#[^,]+)(?!,)$")
rd_sp_imm_regex = re.compile(r"^(r[0-7]), *sp, *(#[^,]+)(?!,)$")
sp_or_sp_sp_imm_regex = re.compile(r"^(sp, *){1,2}(#[^,]+)(?!,)$")
rhs_regex = re.compile(r"^(r[0-9]|r1[0-2]|sp|lr|pc)$")
rd_label_regex = re.compile(r"^(r[0-7]), *(?! )(?!\[)(.+)$")
rd_pool_regex = re.compile(r"^(r[0-7]), *=([^,]+)(?!,)$")
rd_deref_rb_ro_regex = re.compile(r"^(r[0-7]), *\[ *(r[0-7]), *(r[0-7]) *\]$")
rd_deref_rb_imm_regex = re.compile(r"^(r[0-7]), *\[ *(r[0-7])((?= *\])|, *(#[^\]]+)) *\]$")
rd_deref_sp_imm_regex = re.compile(r"^(r[0-7]), *\[ *sp((?= *\])|, *(#[^\]]+)) *\]$")
rlist_regex = re.compile(r"^({[^}]+})$")
rb_excl_rlist_regex = re.compile(r"^(r[0-7])!, *({[^}]+})$")
label_or_imm_regex = re.compile(r"^(.+)$")
````

````python
lsl_imm_opcode = Opcode(rd_rs_imm_regex, lsl_imm_opcode_function)
lsl_reg_opcode = Opcode(rd_rs_regex, lsl_reg_opcode_function)
lsr_imm_opcode = Opcode(rd_rs_imm_regex, lsr_imm_opcode_function)
lsr_reg_opcode = Opcode(rd_rs_regex, lsr_reg_opcode_function)
asr_imm_opcode = Opcode(rd_rs_imm_regex, asr_imm_opcode_function)
asr_reg_opcode = Opcode(rd_rs_regex, asr_reg_opcode_function)
add_rd_rs_rn_opcode = Opcode(rd_rs_rn_regex, add_rd_rs_rn_opcode_function)
add_rd_rs_imm_opcode = Opcode(rd_rs_imm_regex, add_rd_rs_imm_opcode_function)
add_rd_imm_opcode = Opcode(rd_imm_regex, add_rd_imm_opcode_function)
add_rhd_rhs_opcode = Opcode(rhd_rhs_regex, add_rhd_rhs_opcode_function)
add_rd_sp_imm_opcode = Opcode(rd_sp_imm_regex, add_rd_sp_imm_opcode_function)
add_sp_opcode = Opcode(sp_or_sp_sp_imm_regex, add_sp_opcode_function)
sub_rd_rs_rn_opcode = Opcode(rd_rs_rn_regex, sub_rd_rs_rn_opcode_function)
sub_rd_rs_imm_opcode = Opcode(rd_rs_imm_regex, sub_rd_rs_imm_opcode_function)
sub_rd_imm_opcode = Opcode(rd_imm_regex, sub_rd_imm_opcode_function)
sub_rd_rs_opcode = Opcode(rd_rs_regex, sub_rd_rs_opcode_function)
sub_sp_opcode = Opcode(sp_or_sp_sp_imm_regex, sub_sp_opcode_function)
mov_imm_opcode = Opcode(rd_imm_regex, mov_imm_opcode_function)
mov_reg_opcode = Opcode(rhd_rhs_regex, mov_reg_opcode_function)
cmp_imm_opcode = Opcode(rd_imm_regex, cmp_imm_opcode_function)
cmp_reg_opcode = Opcode(rhd_rhs_regex, cmp_reg_opcode_function)
and_opcode = Opcode(rd_rs_regex, and_opcode_function)
eor_opcode = Opcode(rd_rs_regex, eor_opcode_function)
adc_opcode = Opcode(rd_rs_regex, adc_opcode_function)
sbc_opcode = Opcode(rd_rs_regex, sbc_opcode_function)
ror_opcode = Opcode(rd_rs_regex, ror_opcode_function)
tst_opcode = Opcode(rd_rs_regex, tst_opcode_function)
neg_opcode = Opcode(rd_rs_regex, neg_opcode_function)
cmn_opcode = Opcode(rd_rs_regex, cmn_opcode_function)
orr_opcode = Opcode(rd_rs_regex, orr_opcode_function)
mul_opcode = Opcode(rd_rs_regex, mul_opcode_function)
bic_opcode = Opcode(rd_rs_regex, bic_opcode_function)
mvn_opcode = Opcode(rd_rs_regex, mvn_opcode_function)
bx_opcode = Opcode(rhs_regex, bx_opcode_function)
ldr_label_opcode = Opcode(rd_label_regex, ldr_label_opcode_function)
ldr_pool_opcode = Opcode(rd_pool_regex, ldr_pool_opcode_function)
ldr_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, ldr_rb_ro_opcode_function)
ldr_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, ldr_rb_imm_opcode_function)
ldr_sp_imm_opcode = Opcode(rd_deref_sp_imm_regex, ldr_sp_imm_opcode_function)
str_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, str_rb_ro_opcode_function)
str_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, str_rb_imm_opcode_function)
str_sp_imm_opcode = Opcode(rd_deref_sp_imm_regex, str_sp_imm_opcode_function)
ldrb_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, ldrb_rb_ro_opcode_function)
ldrb_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, ldrb_rb_imm_opcode_function)
strb_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, strb_rb_ro_opcode_function)
strb_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, strb_rb_imm_opcode_function)
ldrh_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, ldrh_rb_ro_opcode_function)
ldrh_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, ldrh_rb_imm_opcode_function)
strh_rb_ro_opcode = Opcode(rd_deref_rb_ro_regex, strh_rb_ro_opcode_function)
strh_rb_imm_opcode = Opcode(rd_deref_rb_imm_regex, strh_rb_imm_opcode_function)
ldrsb_opcode = Opcode(rd_deref_rb_ro_regex, ldrsb_opcode_function)
ldrsh_opcode = Opcode(rd_deref_rb_ro_regex, ldrsh_opcode_function)
adr_opcode = Opcode(rd_label_regex, adr_opcode_function)
push_opcode = Opcode(rlist_regex, push_opcode_function)
pop_opcode = Opcode(rlist_regex, pop_opcode_function)
stmia_opcode = Opcode(rb_excl_rlist_regex, stmia_opcode_function)
ldmia_opcode = Opcode(rb_excl_rlist_regex, ldmia_opcode_function)
beq_opcode = Opcode(label_or_imm_regex, beq_opcode_function)
bne_opcode = Opcode(label_or_imm_regex, bne_opcode_function)
bcs_opcode = Opcode(label_or_imm_regex, bcs_opcode_function)
bcc_opcode = Opcode(label_or_imm_regex, bcc_opcode_function)
bmi_opcode = Opcode(label_or_imm_regex, bmi_opcode_function)
bpl_opcode = Opcode(label_or_imm_regex, bpl_opcode_function)
bvs_opcode = Opcode(label_or_imm_regex, bvs_opcode_function)
bvc_opcode = Opcode(label_or_imm_regex, bvc_opcode_function)
bhi_opcode = Opcode(label_or_imm_regex, bhi_opcode_function)
bls_opcode = Opcode(label_or_imm_regex, bls_opcode_function)
bge_opcode = Opcode(label_or_imm_regex, bge_opcode_function)
blt_opcode = Opcode(label_or_imm_regex, blt_opcode_function)
bgt_opcode = Opcode(label_or_imm_regex, bgt_opcode_function)
ble_opcode = Opcode(label_or_imm_regex, ble_opcode_function)
swi_opcode = Opcode(label_or_imm_regex, swi_opcode_function)
b_opcode = Opcode(label_or_imm_regex, b_opcode_function)
bl_opcode = Opcode(label_or_imm_regex, bl_opcode_function)
movflag_pseudo_opcode = Opcode(label_or_imm_regex, movflag_pseudo_opcode_function)
````

2025-11-04 Wk 45 Tue - 08:21 +03:00

````rust
const RHD_RHS_REGEX: &'static str         = r"^(r[0-9]|r1[0-2]|sp|lr|pc), *(r1[0-2]|r[0-9]|sp|lr|pc)(?!,)";
const RD_RS_REGEX: &'static str           = r"^(r[0-7]), *(r[0-7])(?!,)";
const RD_RS_IMM_REGEX: &'static str       = r"^(r[0-7]), *(r[0-7]), *(#[^,]+)(?!,)";
const RD_RS_RN_REGEX: &'static str        = r"^(r[0-7]), *(r[0-7]), *(r[0-7])";
const RD_IMM_REGEX: &'static str          = r"^(r[0-7]), *(#[^,]+)(?!,)";
const RD_SP_IMM_REGEX: &'static str       = r"^(r[0-7]), *sp, *(#[^,]+)(?!,)";
const SP_OR_SP_SP_IMM_REGEX: &'static str = r"^(sp, *){1,2}(#[^,]+)(?!,)";
const RHS_REGEX: &'static str             = r"^(r[0-9]|r1[0-2]|sp|lr|pc)";
const RD_LABEL_REGEX: &'static str        = r"^(r[0-7]), *(?! )(?!\[)(.+)";
const RD_POOL_REGEX: &'static str         = r"^(r[0-7]), *=([^,]+)(?!,)";
const RD_DEREF_RB_RO_REGEX: &'static str  = r"^(r[0-7]), *\[ *(r[0-7]), *(r[0-7]) *\]";
const RD_DEREF_RB_IMM_REGEX: &'static str = r"^(r[0-7]), *\[ *(r[0-7])((?= *\])|, *(#[^\]]+)) *\]";
const RD_DEREF_SP_IMM_REGEX: &'static str = r"^(r[0-7]), *\[ *sp((?= *\])|, *(#[^\]]+)) *\]";
const RLIST_REGEX: &'static str           = r"^({[^}]+})";
const RB_EXCL_RLIST_REGEX: &'static str   = r"^(r[0-7])!, *({[^}]+})";
const LABEL_OR_IMM_REGEX: &'static str    = r"^(.+)";
````

2025-11-04 Wk 45 Tue - 08:55 +03:00

````
Lsl_ImmThumbOpCode,                          RD_RS_IMM_REGEX
Lsl_RegThumbOpCode,                          RD_RS_REGEX                                                       
Lsr_ImmThumbOpCode,                          RD_RS_IMM_REGEX
Lsr_RegThumbOpCode,                          RD_RS_REGEX
Asr_ImmThumbOpCode,                          RD_RS_IMM_REGEX
Asr_RegThumbOpCode,                          RD_RS_REGEX
Add_RdRsRnThumbOpCode,                       RD_RS_RN_REGEX
Add_RdRsImmThumbOpCode,                      RD_RS_IMM_REGEX
Add_RdImmThumbOpCode,                        RD_IMM_REGEX
Add_RhdRhsThumbOpCode,                       RHD_RHS_REGEX
Add_RdSpImmThumbOpCode,                      RD_SP_IMM_REGEX
Add_SpThumbOpCode,                           SP_OR_SP_SP_IMM_REGEX
Sub_RdRsRnThumbOpCode,                       RD_RS_RN_REGEX
Sub_RdRsImmThumbOpCode,                      RD_RS_IMM_REGEX
Sub_RdImmThumbOpCode,                        RD_IMM_REGEX
Sub_RdRsThumbOpCode,                         RD_RS_REGEX
Sub_SpThumbOpCode,                           SP_OR_SP_SP_IMM_REGEX
Mov_ImmThumbOpCode,                          RD_IMM_REGEX
Mov_RegThumbOpCode,                          RHD_RHS_REGEX
Cmp_ImmThumbOpCode,                          RD_IMM_REGEX
Cmp_RegThumbOpCode,                          RHD_RHS_REGEX
And_ThumbOpCode,                             RD_RS_REGEX                                                       
Eor_ThumbOpCode,                             RD_RS_REGEX                                                       
Adc_ThumbOpCode,                             RD_RS_REGEX                                                       
Sbc_ThumbOpCode,                             RD_RS_REGEX                                                       
Ror_ThumbOpCode,                             RD_RS_REGEX                                                       
Tst_ThumbOpCode,                             RD_RS_REGEX                                                          
Neg_ThumbOpCode,                             RD_RS_REGEX                                                           
Cmn_ThumbOpCode,                             RD_RS_REGEX                                                         
Orr_ThumbOpCode,                             RD_RS_REGEX                                                          
Mul_ThumbOpCode,                             RD_RS_REGEX                                                           
Bic_ThumbOpCode,                             RD_RS_REGEX                                                      
Mvn_ThumbOpCode,                             RD_RS_REGEX                                                          
Bx_ThumbOpCode,                              RHS_REGEX                                                             
Ldr_LabelThumbOpCode,                        RD_LABEL_REGEX                                                      
Ldr_PoolThumbOpCode,                         RD_POOL_REGEX                                                      
Ldr_RbRoThumbOpCode,                         RD_DEREF_RB_RO_REGEX                                             
Ldr_RbImmThumbOpCode,                        RD_DEREF_RB_IMM_REGEX                                             
Ldr_SpImmThumbOpCode,                        RD_DEREF_SP_IMM_REGEX                                             
Str_RbRoThumbOpCode,                         RD_DEREF_RB_RO_REGEX                                              
Str_RbImmThumbOpCode,                        RD_DEREF_RB_IMM_REGEX                                             
Str_SpImmThumbOpCode,                        RD_DEREF_SP_IMM_REGEX                                          
Ldrb_RbRoThumbOpCode,                        RD_DEREF_RB_RO_REGEX                                           
Ldrb_RbImmThumbOpCode,                       RD_DEREF_RB_IMM_REGEX                                          
Strb_RbRoThumbOpCode,                        RD_DEREF_RB_RO_REGEX                                           
Strb_RbImmThumbOpCode,                       RD_DEREF_RB_IMM_REGEX                                          
Ldrh_RbRoThumbOpCode,                        RD_DEREF_RB_RO_REGEX                                           
Ldrh_RbImmThumbOpCode,                       RD_DEREF_RB_IMM_REGEX                                          
Strh_RbRoThumbOpCode,                        RD_DEREF_RB_RO_REGEX                                           
Strh_RbImmThumbOpCode,                       RD_DEREF_RB_IMM_REGEX                                          
Ldrsb_ThumbOpCode,                           RD_DEREF_RB_RO_REGEX                                           
Ldrsh_ThumbOpCode,                           RD_DEREF_RB_RO_REGEX                                           
Adr_ThumbOpCode,                             RD_LABEL_REGEX                                                 
Push_ThumbOpCode,                            RLIST_REGEX                                                   
Pop_ThumbOpCode,                             RLIST_REGEX                                                         
Stmia_ThumbOpCode,                           RB_EXCL_RLIST_REGEX                                                
Ldmia_ThumbOpCode,                           RB_EXCL_RLIST_REGEX                                                
Beq_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bne_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bcs_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                 
Bcc_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bmi_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bpl_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bvs_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                   
Bvc_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bhi_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                   
Bls_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bge_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                   
Blt_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                  
Bgt_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                                   
Ble_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                               
Swi_ThumbOpCode,                             LABEL_OR_IMM_REGEX                                               
B_ThumbOpCode,                               LABEL_OR_IMM_REGEX                                             
Bl_ThumbOpCode,                              LABEL_OR_IMM_REGEX                                              
Mov_flagPseudoThumbOpCode,                   LABEL_OR_IMM_REGEX                                             
````

*Listing 1: Mapping from instruction opcode to regex*

2025-11-04 Wk 45 Tue - 09:03 +03:00

Processing `Listing 1` snipped with

````
:'<,'>s/\([A-Za-z]*\)_\([A-Za-z_][A-Za-z0-9]*\),\s*\([A-Za-z_][A-Za-z0-9_]*\)\s*/LexonType::\1_\2 => format!("\1 \{\3\}"),
````

yields

````
LexonType::Lsl_ImmThumbOpCode => format!("Lsl {RD_RS_IMM_REGEX}"),
LexonType::Lsl_RegThumbOpCode => format!("Lsl {RD_RS_REGEX}"),
LexonType::Lsr_ImmThumbOpCode => format!("Lsr {RD_RS_IMM_REGEX}"),
LexonType::Lsr_RegThumbOpCode => format!("Lsr {RD_RS_REGEX}"),
LexonType::Asr_ImmThumbOpCode => format!("Asr {RD_RS_IMM_REGEX}"),
LexonType::Asr_RegThumbOpCode => format!("Asr {RD_RS_REGEX}"),
LexonType::Add_RdRsRnThumbOpCode => format!("Add {RD_RS_RN_REGEX}"),
LexonType::Add_RdRsImmThumbOpCode => format!("Add {RD_RS_IMM_REGEX}"),
LexonType::Add_RdImmThumbOpCode => format!("Add {RD_IMM_REGEX}"),
LexonType::Add_RhdRhsThumbOpCode => format!("Add {RHD_RHS_REGEX}"),
LexonType::Add_RdSpImmThumbOpCode => format!("Add {RD_SP_IMM_REGEX}"),
LexonType::Add_SpThumbOpCode => format!("Add {SP_OR_SP_SP_IMM_REGEX}"),
LexonType::Sub_RdRsRnThumbOpCode => format!("Sub {RD_RS_RN_REGEX}"),
LexonType::Sub_RdRsImmThumbOpCode => format!("Sub {RD_RS_IMM_REGEX}"),
LexonType::Sub_RdImmThumbOpCode => format!("Sub {RD_IMM_REGEX}"),
LexonType::Sub_RdRsThumbOpCode => format!("Sub {RD_RS_REGEX}"),
LexonType::Sub_SpThumbOpCode => format!("Sub {SP_OR_SP_SP_IMM_REGEX}"),
LexonType::Mov_ImmThumbOpCode => format!("Mov {RD_IMM_REGEX}"),
LexonType::Mov_RegThumbOpCode => format!("Mov {RHD_RHS_REGEX}"),
LexonType::Cmp_ImmThumbOpCode => format!("Cmp {RD_IMM_REGEX}"),
LexonType::Cmp_RegThumbOpCode => format!("Cmp {RHD_RHS_REGEX}"),
LexonType::And_ThumbOpCode => format!("And {RD_RS_REGEX}"),
LexonType::Eor_ThumbOpCode => format!("Eor {RD_RS_REGEX}"),
LexonType::Adc_ThumbOpCode => format!("Adc {RD_RS_REGEX}"),
LexonType::Sbc_ThumbOpCode => format!("Sbc {RD_RS_REGEX}"),
LexonType::Ror_ThumbOpCode => format!("Ror {RD_RS_REGEX}"),
LexonType::Tst_ThumbOpCode => format!("Tst {RD_RS_REGEX}"),
LexonType::Neg_ThumbOpCode => format!("Neg {RD_RS_REGEX}"),
LexonType::Cmn_ThumbOpCode => format!("Cmn {RD_RS_REGEX}"),
LexonType::Orr_ThumbOpCode => format!("Orr {RD_RS_REGEX}"),
LexonType::Mul_ThumbOpCode => format!("Mul {RD_RS_REGEX}"),
LexonType::Bic_ThumbOpCode => format!("Bic {RD_RS_REGEX}"),
LexonType::Mvn_ThumbOpCode => format!("Mvn {RD_RS_REGEX}"),
LexonType::Bx_ThumbOpCode => format!("Bx {RHS_REGEX}"),
LexonType::Ldr_LabelThumbOpCode => format!("Ldr {RD_LABEL_REGEX}"),
LexonType::Ldr_PoolThumbOpCode => format!("Ldr {RD_POOL_REGEX}"),
LexonType::Ldr_RbRoThumbOpCode => format!("Ldr {RD_DEREF_RB_RO_REGEX}"),
LexonType::Ldr_RbImmThumbOpCode => format!("Ldr {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Ldr_SpImmThumbOpCode => format!("Ldr {RD_DEREF_SP_IMM_REGEX}"),
LexonType::Str_RbRoThumbOpCode => format!("Str {RD_DEREF_RB_RO_REGEX}"),
LexonType::Str_RbImmThumbOpCode => format!("Str {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Str_SpImmThumbOpCode => format!("Str {RD_DEREF_SP_IMM_REGEX}"),
LexonType::Ldrb_RbRoThumbOpCode => format!("Ldrb {RD_DEREF_RB_RO_REGEX}"),
LexonType::Ldrb_RbImmThumbOpCode => format!("Ldrb {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Strb_RbRoThumbOpCode => format!("Strb {RD_DEREF_RB_RO_REGEX}"),
LexonType::Strb_RbImmThumbOpCode => format!("Strb {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Ldrh_RbRoThumbOpCode => format!("Ldrh {RD_DEREF_RB_RO_REGEX}"),
LexonType::Ldrh_RbImmThumbOpCode => format!("Ldrh {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Strh_RbRoThumbOpCode => format!("Strh {RD_DEREF_RB_RO_REGEX}"),
LexonType::Strh_RbImmThumbOpCode => format!("Strh {RD_DEREF_RB_IMM_REGEX}"),
LexonType::Ldrsb_ThumbOpCode => format!("Ldrsb {RD_DEREF_RB_RO_REGEX}"),
LexonType::Ldrsh_ThumbOpCode => format!("Ldrsh {RD_DEREF_RB_RO_REGEX}"),
LexonType::Adr_ThumbOpCode => format!("Adr {RD_LABEL_REGEX}"),
LexonType::Push_ThumbOpCode => format!("Push {RLIST_REGEX}"),
LexonType::Pop_ThumbOpCode => format!("Pop {RLIST_REGEX}"),
LexonType::Stmia_ThumbOpCode => format!("Stmia {RB_EXCL_RLIST_REGEX}"),
LexonType::Ldmia_ThumbOpCode => format!("Ldmia {RB_EXCL_RLIST_REGEX}"),
LexonType::Beq_ThumbOpCode => format!("Beq {LABEL_OR_IMM_REGEX}"),
LexonType::Bne_ThumbOpCode => format!("Bne {LABEL_OR_IMM_REGEX}"),
LexonType::Bcs_ThumbOpCode => format!("Bcs {LABEL_OR_IMM_REGEX}"),
LexonType::Bcc_ThumbOpCode => format!("Bcc {LABEL_OR_IMM_REGEX}"),
LexonType::Bmi_ThumbOpCode => format!("Bmi {LABEL_OR_IMM_REGEX}"),
LexonType::Bpl_ThumbOpCode => format!("Bpl {LABEL_OR_IMM_REGEX}"),
LexonType::Bvs_ThumbOpCode => format!("Bvs {LABEL_OR_IMM_REGEX}"),
LexonType::Bvc_ThumbOpCode => format!("Bvc {LABEL_OR_IMM_REGEX}"),
LexonType::Bhi_ThumbOpCode => format!("Bhi {LABEL_OR_IMM_REGEX}"),
LexonType::Bls_ThumbOpCode => format!("Bls {LABEL_OR_IMM_REGEX}"),
LexonType::Bge_ThumbOpCode => format!("Bge {LABEL_OR_IMM_REGEX}"),
LexonType::Blt_ThumbOpCode => format!("Blt {LABEL_OR_IMM_REGEX}"),
LexonType::Bgt_ThumbOpCode => format!("Bgt {LABEL_OR_IMM_REGEX}"),
LexonType::Ble_ThumbOpCode => format!("Ble {LABEL_OR_IMM_REGEX}"),
LexonType::Swi_ThumbOpCode => format!("Swi {LABEL_OR_IMM_REGEX}"),
LexonType::B_ThumbOpCode => format!("B {LABEL_OR_IMM_REGEX}"),
LexonType::Bl_ThumbOpCode => format!("Bl {LABEL_OR_IMM_REGEX}"),
LexonType::Mov_flagPseudoThumbOpCode => format!("Mov {LABEL_OR_IMM_REGEX}"),
````

Now just make sure that each instruction is lower case in the format. Can be done with a macro.

2025-11-04 Wk 45 Tue - 09:43 +03:00

We need to route each opcode to its data format.

Apply to `Listing1` the following replaces:

````
s/RHD_RHS_REGEX/RhdRhs/g
s/RD_RS_REGEX/RdRs/g
s/RD_RS_IMM_REGEX/RdRsImm/g
s/RD_RS_RN_REGEX/RdRsRn/g
s/RD_IMM_REGEX/RdImm/g
s/RD_SP_IMM_REGEX/RdSpImm/g
s/SP_OR_SP_SP_IMM_REGEX/SpOrSpSpImm/g
s/RHS_REGEX/Rhs/g
s/RD_LABEL_REGEX/RdLabel/g
s/RD_POOL_REGEX/RdPool/g
s/RD_DEREF_RB_RO_REGEX/RdDerefRbRo/g
s/RD_DEREF_RB_IMM_REGEX/RdDerefRbImm/g
s/RD_DEREF_SP_IMM_REGEX/RdDerefSpImm/g
s/RLIST_REGEX/RList/g
s/RB_EXCL_RLIST_REGEX/RbExclRList/g
s/LABEL_OR_IMM_REGEX/LabelOrImm/g

````

to create

````
Lsl_ImmThumbOpCode,                          RdRsImm
Lsl_RegThumbOpCode,                          RdRs                                                       
Lsr_ImmThumbOpCode,                          RdRsImm
Lsr_RegThumbOpCode,                          RdRs
Asr_ImmThumbOpCode,                          RdRsImm
Asr_RegThumbOpCode,                          RdRs
Add_RdRsRnThumbOpCode,                       RdRsRn
Add_RdRsImmThumbOpCode,                      RdRsImm
Add_RdImmThumbOpCode,                        RdImm
Add_RhdRhsThumbOpCode,                       RhdRhs
Add_RdSpImmThumbOpCode,                      RdSpImm
Add_SpThumbOpCode,                           SpOrSpSpImm
Sub_RdRsRnThumbOpCode,                       RdRsRn
Sub_RdRsImmThumbOpCode,                      RdRsImm
Sub_RdImmThumbOpCode,                        RdImm
Sub_RdRsThumbOpCode,                         RdRs
Sub_SpThumbOpCode,                           SpOrSpSpImm
Mov_ImmThumbOpCode,                          RdImm
Mov_RegThumbOpCode,                          RhdRhs
Cmp_ImmThumbOpCode,                          RdImm
Cmp_RegThumbOpCode,                          RhdRhs
And_ThumbOpCode,                             RdRs                                                       
Eor_ThumbOpCode,                             RdRs                                                       
Adc_ThumbOpCode,                             RdRs                                                       
Sbc_ThumbOpCode,                             RdRs                                                       
Ror_ThumbOpCode,                             RdRs                                                       
Tst_ThumbOpCode,                             RdRs                                                          
Neg_ThumbOpCode,                             RdRs                                                           
Cmn_ThumbOpCode,                             RdRs                                                         
Orr_ThumbOpCode,                             RdRs                                                          
Mul_ThumbOpCode,                             RdRs                                                           
Bic_ThumbOpCode,                             RdRs                                                      
Mvn_ThumbOpCode,                             RdRs                                                          
Bx_ThumbOpCode,                              Rhs                                                             
Ldr_LabelThumbOpCode,                        RdLabel                                                      
Ldr_PoolThumbOpCode,                         RdPool                                                      
Ldr_RbRoThumbOpCode,                         RdDerefRbRo                                             
Ldr_RbImmThumbOpCode,                        RdDerefRbImm                                             
Ldr_SpImmThumbOpCode,                        RdDerefSpImm                                             
Str_RbRoThumbOpCode,                         RdDerefRbRo                                              
Str_RbImmThumbOpCode,                        RdDerefRbImm                                             
Str_SpImmThumbOpCode,                        RdDerefSpImm                                          
Ldrb_RbRoThumbOpCode,                        RdDerefRbRo                                           
Ldrb_RbImmThumbOpCode,                       RdDerefRbImm                                          
Strb_RbRoThumbOpCode,                        RdDerefRbRo                                           
Strb_RbImmThumbOpCode,                       RdDerefRbImm                                          
Ldrh_RbRoThumbOpCode,                        RdDerefRbRo                                           
Ldrh_RbImmThumbOpCode,                       RdDerefRbImm                                          
Strh_RbRoThumbOpCode,                        RdDerefRbRo                                           
Strh_RbImmThumbOpCode,                       RdDerefRbImm                                          
Ldrsb_ThumbOpCode,                           RdDerefRbRo                                           
Ldrsh_ThumbOpCode,                           RdDerefRbRo                                           
Adr_ThumbOpCode,                             RdLabel                                                 
Push_ThumbOpCode,                            RList                                                   
Pop_ThumbOpCode,                             RList                                                         
Stmia_ThumbOpCode,                           RB_EXCL_RList                                                
Ldmia_ThumbOpCode,                           RB_EXCL_RList                                                
Beq_ThumbOpCode,                             LabelOrImm                                                  
Bne_ThumbOpCode,                             LabelOrImm                                                  
Bcs_ThumbOpCode,                             LabelOrImm                                                 
Bcc_ThumbOpCode,                             LabelOrImm                                                  
Bmi_ThumbOpCode,                             LabelOrImm                                                  
Bpl_ThumbOpCode,                             LabelOrImm                                                  
Bvs_ThumbOpCode,                             LabelOrImm                                                   
Bvc_ThumbOpCode,                             LabelOrImm                                                  
Bhi_ThumbOpCode,                             LabelOrImm                                                   
Bls_ThumbOpCode,                             LabelOrImm                                                  
Bge_ThumbOpCode,                             LabelOrImm                                                   
Blt_ThumbOpCode,                             LabelOrImm                                                  
Bgt_ThumbOpCode,                             LabelOrImm                                                   
Ble_ThumbOpCode,                             LabelOrImm                                               
Swi_ThumbOpCode,                             LabelOrImm                                               
B_ThumbOpCode,                               LabelOrImm                                             
Bl_ThumbOpCode,                              LabelOrImm                                              
Mov_flagPseudoThumbOpCode,                   LabelOrImm                                             
````

*Listing 2: Mapping between opcode and data format*

This can be used for filling in for `to_lexon_data_type`:

Apply

````
:'<,'>s/\([A-Za-z_][A-Za-z0-9_]*\),\s*\([A-Za-z_][A-Za-z0-9_]*\).*/LexonType::\1 => LexonDataType::\2,/g
````

to `Listing 2` to get:

````
LexonType::Lsl_ImmThumbOpCode => LexonDataType::RdRsImm,
LexonType::Lsl_RegThumbOpCode => LexonDataType::RdRs,
LexonType::Lsr_ImmThumbOpCode => LexonDataType::RdRsImm,
LexonType::Lsr_RegThumbOpCode => LexonDataType::RdRs,
LexonType::Asr_ImmThumbOpCode => LexonDataType::RdRsImm,
LexonType::Asr_RegThumbOpCode => LexonDataType::RdRs,
LexonType::Add_RdRsRnThumbOpCode => LexonDataType::RdRsRn,
LexonType::Add_RdRsImmThumbOpCode => LexonDataType::RdRsImm,
LexonType::Add_RdImmThumbOpCode => LexonDataType::RdImm,
LexonType::Add_RhdRhsThumbOpCode => LexonDataType::RhdRhs,
LexonType::Add_RdSpImmThumbOpCode => LexonDataType::RdSpImm,
LexonType::Add_SpThumbOpCode => LexonDataType::SpOrSpSpImm,
LexonType::Sub_RdRsRnThumbOpCode => LexonDataType::RdRsRn,
LexonType::Sub_RdRsImmThumbOpCode => LexonDataType::RdRsImm,
LexonType::Sub_RdImmThumbOpCode => LexonDataType::RdImm,
LexonType::Sub_RdRsThumbOpCode => LexonDataType::RdRs,
LexonType::Sub_SpThumbOpCode => LexonDataType::SpOrSpSpImm,
LexonType::Mov_ImmThumbOpCode => LexonDataType::RdImm,
LexonType::Mov_RegThumbOpCode => LexonDataType::RhdRhs,
LexonType::Cmp_ImmThumbOpCode => LexonDataType::RdImm,
LexonType::Cmp_RegThumbOpCode => LexonDataType::RhdRhs,
LexonType::And_ThumbOpCode => LexonDataType::RdRs,
LexonType::Eor_ThumbOpCode => LexonDataType::RdRs,
LexonType::Adc_ThumbOpCode => LexonDataType::RdRs,
LexonType::Sbc_ThumbOpCode => LexonDataType::RdRs,
LexonType::Ror_ThumbOpCode => LexonDataType::RdRs,
LexonType::Tst_ThumbOpCode => LexonDataType::RdRs,
LexonType::Neg_ThumbOpCode => LexonDataType::RdRs,
LexonType::Cmn_ThumbOpCode => LexonDataType::RdRs,
LexonType::Orr_ThumbOpCode => LexonDataType::RdRs,
LexonType::Mul_ThumbOpCode => LexonDataType::RdRs,
LexonType::Bic_ThumbOpCode => LexonDataType::RdRs,
LexonType::Mvn_ThumbOpCode => LexonDataType::RdRs,
LexonType::Bx_ThumbOpCode => LexonDataType::Rhs,
LexonType::Ldr_LabelThumbOpCode => LexonDataType::RdLabel,
LexonType::Ldr_PoolThumbOpCode => LexonDataType::RdPool,
LexonType::Ldr_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Ldr_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Ldr_SpImmThumbOpCode => LexonDataType::RdDerefSpImm,
LexonType::Str_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Str_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Str_SpImmThumbOpCode => LexonDataType::RdDerefSpImm,
LexonType::Ldrb_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Ldrb_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Strb_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Strb_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Ldrh_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Ldrh_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Strh_RbRoThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Strh_RbImmThumbOpCode => LexonDataType::RdDerefRbImm,
LexonType::Ldrsb_ThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Ldrsh_ThumbOpCode => LexonDataType::RdDerefRbRo,
LexonType::Adr_ThumbOpCode => LexonDataType::RdLabel,
LexonType::Push_ThumbOpCode => LexonDataType::RList,
LexonType::Pop_ThumbOpCode => LexonDataType::RList,
LexonType::Stmia_ThumbOpCode => LexonDataType::RB_EXCL_RList,
LexonType::Ldmia_ThumbOpCode => LexonDataType::RB_EXCL_RList,
LexonType::Beq_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bne_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bcs_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bcc_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bmi_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bpl_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bvs_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bvc_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bhi_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bls_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bge_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Blt_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bgt_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Ble_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Swi_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::B_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Bl_ThumbOpCode => LexonDataType::LabelOrImm,
LexonType::Mov_flagPseudoThumbOpCode => LexonDataType::LabelOrImm,
````

Fix `RB_EXCL_RList` manually to `RbExclRList`
